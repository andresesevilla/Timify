<template>
  <section class="calendar-container">
    <FullCalendar ref="fullCalendar" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <div class="event-content">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </div>
      </template>
    </FullCalendar>
    <transition name="fade">
      <nav class="card event-control" v-if="eventSelected">
        <div class="card-wrapper" v-if="!eventSelected.editing">
          <header class="card-header">
            <p class="card-header-title">{{ eventSelected.title }}</p>
          </header>
          <div class="card-content">
            <div class="content">
              <span>{{ startEventSelected }} to {{ endEventSelected }}</span>
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" @click="editSelected">Edit</a>
            <a class="card-footer-item" @click="deleteSelected">Delete</a>
          </footer>
        </div>

        <div class="card-wrapper" v-else>
          <header class="card-header">
            <p class="card-header-title">
              <CategoryAutocomplete
                :value="eventSelected.title"
                :categories="categories"
                :loading="categoriesLoading"
                @select="updateEventSelected({ title: $event })"
                @add-category="(category) => {this.categories.unshift(category);}"
                ref="categoryAutocomplete"
              />
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <b-field class="time-input" :type="{'is-danger': eventDraft.start >= eventDraft.end}" :message="{'Please input correct time range': eventDraft.start >= eventDraft.end}">
                <b-timepicker
                  v-model="eventDraft.start"
                  @input="eventSelected.setStart(eventDraft.start)"
                  inline
                  :increment-minutes="5"
                ></b-timepicker>
                <span>to</span>
                <b-timepicker
                  v-model="eventDraft.end"
                  @input="eventSelected.setEnd(eventDraft.end)"
                  inline
                  :increment-minutes="5"
                ></b-timepicker
              ></b-field>
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" @click="() => { cancelSelected(); eventSelected = eventDraft = null; }">Cancel</a>
            <a class="card-footer-item" @click="() => { saveSelected(); eventSelected = eventDraft = null; }">Save</a>
          </footer>
        </div>
      </nav>
    </transition>
  </section>
</template>

<script>
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CategoryAutocomplete from "@/components/Category/CategoryAutocomplete.vue";
import PlayButton from "@/components/Calendar/PlayButton.vue";

export default {
  name: "DailyCalendar",
  components: {
    PlayButton,
    FullCalendar,
    CategoryAutocomplete,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [timeGridPlugin, interactionPlugin],
        allDaySlot: false,
        nowIndicator: true,
        initialView: "timeGridDay",

        editable: true,
        selectable: true,
        eventResizableFromStart: true,
        selectMirror: true,

        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,

        eventResize: this.handleEventDragOrResize,
        eventDrop: this.handleEventDragOrResize,

        eventShortHeight: 15,
        slotDuration: "00:15:00",
        scrollTime: new Date().getHours() - 1 + ":00:00",

        events: [],
        eventOverlap: false,

        eventColor: "#087f5b",
      },
      eventSelected: null,
      eventDraft: null,
      beforeEdit: null,

      categories: [],
      categoriesLoading: true,

      isPlaying: false,
    };
  },
  computed: {
    startEventSelected() {
      return this.eventSelected ? this.hmTime(this.eventSelected.start) : null;
    },
    endEventSelected() {
      return this.eventSelected ? this.hmTime(this.eventSelected.end) : null;
    },
    isEventDraft() {
      return this.eventSelected && !this.eventSelected.id;
    }
  },
  mounted() {
    // get categories
    fetch("/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        this.categories = categories.map((category) => category.name);
        this.categoriesLoading = false;
      });
    this.fetchEvents();

    document.addEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    fetchEvents() {
      fetch("/api/entries")
        .then((response) => response.json())
        .then((entries) => {
          this.calendarOptions.events = entries.map((entry) => {
            return {
              id: entry._id,
              title: entry.category,
              start: entry.start,
              end: entry.end,
            };
          });
        });
      this.eventSelected = this.eventDraft = null;
    },
    hmTime(date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    },
    handleDateSelect(selectionInfo) {
      if (this.isEventDraft) {
        if (this.validateEvent(this.eventSelected)) {
          this.saveSelected(this.eventSelected);
        } else {
          this.eventSelected.remove();
        }
      }
      const calendarApi = this.$refs.fullCalendar.getApi();
      this.eventSelected = calendarApi.addEvent({
        id: "", // needs to be falsy value!
        title: "",
        start: selectionInfo.startStr,
        end: selectionInfo.endStr,
        allDay: selectionInfo.allDay,
      });

      this.$nextTick(() => {
        this.$refs.categoryAutocomplete.reset();
      });

      this.editSelected();
      calendarApi.unselect();
    },
    handleEventClick(clickInfo) {
      if (this.isPlaying) return;

      if (this.eventSelected && this.eventSelected.id === clickInfo.event.id) {
        this.eventSelected = this.eventDraft = null;
      } else {
        this.eventSelected = clickInfo.event;
      }
    },
    handleEventDragOrResize(info) {
      if (this.isEventDraft) {
        this.eventDraft = {start: info.event.start, end: info.event.end};
        const oldTitle = this.eventSelected.title;
        this.eventSelected = info.event;
        this.eventSelected.setProp("title", oldTitle);
        this.eventSelected.editing = true;
        return;
      }
      let wasEditing = false;
      if (this.eventSelected && this.eventSelected.editing) {
        wasEditing = true;
      }
      this.eventSelected = info.event;
      if (wasEditing) this.editSelected();
      this.tryUpdateEvent(info.event);
    },
    tryUpdateEvent(event) {
      if (!this.validateEvent(event)) {
        return;
      }
      this.saveSelected(event);
    },
    validateEvent(event) {
      // check if event overlaps with another event
      const calendarApi = this.$refs.fullCalendar.getApi();
      const events = calendarApi.getEvents();
      for (let i = 0; i < events.length; i++) {
        if (events[i].id === event.id) {
          continue;
        }
        if (event.start < events[i].end && event.end > events[i].start || event.start < events[i].start && event.end > events[i].start) {
          this.$buefy.toast.open({
            message: "Events cannot overlap",
            type: "is-danger",
          });
          this.cancelSelected(); // TODO maybe do better without canceling? (reason this exists: if you make popup disappear, it will appear on the calendar)
          return false;
        }
      }
      if (!this.categories.includes(event.title)) {
        this.$buefy.toast.open({
          message: "Category does not exist",
          type: "is-danger",
        });
        return false;
      }
      return true;
    },
    editSelected() {
      this.$set(this.eventSelected, "editing", true);
      this.eventDraft = {
        start: this.eventSelected.start,
        end: this.eventSelected.end,
      };
      this.beforeEdit = {...this.eventDraft};
    },
    deleteSelected() {
      fetch(`/api/entries/${this.eventSelected.id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            this.$buefy.toast.open({
              message: response.error,
              type: "is-danger",
            });
            this.fetchEvents();
            return;
          }
          this.eventSelected.remove();
          this.eventSelected = null;
          this.$emit("refreshGoals");
        });
    },
    saveSelected(event = this.eventSelected) {
      if (!this.validateEvent(event)) {
        return;
      }
      const url = !event.id
        ? "/api/entries"
        : `/api/entries/${event.id}`;
      fetch(url, {
        method: !event.id ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: event.title,
          start: event.start,
          end: event.end,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            this.$buefy.toast.open({
              message: response.error,
              type: "is-danger",
            });
            event.remove();
            event = null;
            this.fetchEvents();
            return;
          }
          event.setProp("id", response.entry._id);
          this.$emit("refreshGoals");
        });
    },
    cancelSelected() {
      if (!this.eventSelected.id) {
        this.eventSelected.remove();
      }
      if (this.beforeEdit) {
        this.eventSelected.setStart(this.beforeEdit.start);
        this.eventSelected.setEnd(this.beforeEdit.end);
        this.beforeEdit = null;
      }
      this.eventSelected = this.eventDraft = null;
    },
    updateEventSelected(update) {
      if (update.title) {
        this.eventSelected.setProp("title", update.title);
      }
    },

    handleKeyDown(event) {
      if (this.isPlaying || document.querySelector(".dialog.modal.is-active")) return;


      if (this.eventSelected) {
        if (event.key === "Escape") {
          this.cancelSelected();
          return;
        }

        if (this.eventSelected.editing) {
          if (event.key === "Enter") {
            console.log(JSON.stringify(this.eventSelected))
            if (!this.eventSelected.title) return;

            this.saveSelected(this.eventSelected);
            this.eventSelected = this.eventDraft = null;
          }
        } else {
          if (event.key === "Delete") {
            this.deleteSelected();
          } else if (event.key === "Enter") {
            this.editSelected();
          }
        }
      }
    },
  },
  watch: {
    "$store.state.playing": function (playing) {
      const calApi = this.$refs.fullCalendar.getApi();  

      if (playing === null) { // playing is bad event, just skip over it
        calApi.getEventById("playing").remove();
        this.isPlaying = false;
      } else if (playing.end) { // end of the event, add it to the calendar
        calApi.getEventById("playing").remove();
        calApi.addEvent({
          id: playing.id,
          title: playing.title,
          start: playing.start,
          end: playing.end,
        });
        this.isPlaying = false;
      } else { // here it should have start, so just add it as playing
        calApi.addEvent({
          title: playing.title,
          start: new Date(),
          color: "green",
          id: "playing",
        });
        this.isPlaying = true;
      }

      calApi.setOption("editable", !this.isPlaying);
      calApi.setOption("selectable", !this.isPlaying);
    },
  }
};
</script>

<style lang="scss">
.fc .fc-col-header-cell-cushion {
  color: #087f5b
}

.fc-event-dragging .fc-event-main {
  cursor: move;
}
// TODO that will probably take me absurd amount of time later: make resizer smoother
</style>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.calendar-container {
  position: relative;
  --fc-today-bg-color: #e6fcf5;  
}

.event-control {
  z-index: 20;
  position: absolute;
  top: 6em;
  right: 1em;
}

.event-content {
  display: flex;
  gap: 0.5em;
  font-size: 1.2em;
}

</style>

<style>
.field.time-input .field.has-addons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}

</style>
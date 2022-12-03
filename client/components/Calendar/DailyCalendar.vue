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
        <div class="card-wrapper" v-if="!editingSelected">
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
                @add-category="(category) => {this.categories.push(category);}"
                ref="categoryAutocomplete"
              />
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <span>
                <b-timepicker
                  v-model="eventDraft.start"
                  @input="eventSelected.setStart(eventDraft.start)"
                  inline
                  :increment-minutes="5"
                ></b-timepicker>
                to
                <b-timepicker
                  v-model="eventDraft.end"
                  @input="eventSelected.setEnd(eventDraft.end)"
                  inline
                  :increment-minutes="5"
                ></b-timepicker
              ></span>
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" @click="cancelSelected">Cancel</a>
            <a class="card-footer-item" @click="saveSelected">Save</a>
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

export default {
  name: "DailyCalendar",
  components: {
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

        eventResizeStart: this.handleEventResizeStart,
        eventResize: this.handleEventResize,
        eventDragStart: this.handleEventDragStart,
        eventDrop: this.handleEventDrag,

        eventShortHeight: 15,
        slotDuration: "00:15:00",
        scrollTime: new Date().getHours() - 1 + ":00:00",

        events: [],
        eventOverlap: false,
      },
      eventSelected: null,
      editingSelected: false,
      eventDraft: null,

      categories: [],
      categoriesLoading: true,
    };
  },
  computed: {
    startEventSelected() {
      return this.eventSelected ? this.hmTime(this.eventSelected.start) : null;
    },
    endEventSelected() {
      return this.eventSelected ? this.hmTime(this.eventSelected.end) : null;
    },
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
      this.eventSelected = null;
      this.editingSelected = false;
      this.eventDraft = null;
    },
    hmTime(date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    },
    handleDateSelect(selectionInfo) {
      const calendarApi = this.$refs.fullCalendar.getApi();
      this.eventSelected = calendarApi.addEvent({
        id: "",
        title: "",
        start: selectionInfo.startStr,
        end: selectionInfo.endStr,
        allDay: selectionInfo.allDay,
      });
      this.eventSelected.draft = true;
      this.editSelected();
      calendarApi.unselect();
    },
    handleEventClick(clickInfo) {
      if (this.eventSelected && this.eventSelected.id === clickInfo.event.id) {
        this.eventSelected = null;
        this.editingSelected = false;
      } else {
        this.eventSelected = clickInfo.event;
      }
    },
    handleEventResize(eventResizeInfo) {
      this.tryUpdateEvent(eventResizeInfo.event);
    },
    handleEventDrag(eventDragInfo) {
      this.tryUpdateEvent(eventDragInfo.event);
    },
    tryUpdateEvent(event) {
      if (!this.isValidEvent(event)) {
        return;
      }
      this.eventSelected = event;
      this.saveSelected();
    },
    isValidEvent(event) {
      return true;
    },
    editSelected() {
      this.editingSelected = true;
      this.eventDraft = {
        start: this.eventSelected.start,
        end: this.eventSelected.end,
      };
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
        });
    },
    saveSelected() {
      const url = this.eventSelected.draft
        ? "/api/entries"
        : `/api/entries/${this.eventSelected.id}`;
      fetch(url, {
        method: this.eventSelected.draft ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: this.eventSelected.title,
          start: this.eventSelected.start,
          end: this.eventSelected.end,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            this.$buefy.toast.open({
              message: response.error,
              type: "is-danger",
            });
            this.eventSelected.remove();
            this.eventSelected = null;
            this.editingSelected = false;
            this.fetchEvents();
            return;
          }
          this.eventSelected.setProp("id", response.entry._id);
          this.eventSelected = null;
          this.editingSelected = false;
        });
    },
    cancelSelected() {
      if (this.eventSelected.draft) {
        this.eventSelected.remove();
      }
      this.eventSelected = null;
      this.editingSelected = false;
    },
    updateEventSelected(update) {
      if (update.title) {
        this.eventSelected.setProp("title", update.title);
      }
    },

    handleKeyDown(event) {
      if (this.eventSelected) {
        if (event.key === "Escape") {
          this.cancelSelected();
          return;
        }

        if (this.editingSelected) {
          if (event.key === "Enter") {
            this.saveSelected();
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
    eventSelected(newVal) {
      if (newVal && this.editingSelected) {
        this.$nextTick(() => {
          this.$refs.categoryAutocomplete.focus();
        });
      }
    }
  }
};
</script>

<style lang="scss">
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
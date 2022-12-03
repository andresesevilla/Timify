<template>
  <section class="calendar-container">
    <FullCalendar ref="fullCalendar" :options="calendarOptions">
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
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
                :value="eventSelected.title" :categories="categories" :loading="categoriesLoading"
                @select="updateEventSelected({'title': $event})"
              />
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              <span>
                <b-timepicker v-model="eventDraft.start" @input="eventSelected.setStart(eventDraft.start)" inline :increment-minutes="5"></b-timepicker> 
                to
                <b-timepicker v-model="eventDraft.end" @input="eventSelected.setEnd(eventDraft.end)" inline :increment-minutes="5"></b-timepicker></span>
            </div>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item" @click="saveSelected">Save</a>
            <a class="card-footer-item" @click="cancelSelected">Cancel</a>
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
    FullCalendar, CategoryAutocomplete
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
        select: this.handleDateSelect,
        selectMirror: true,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventShortHeight: 15,
        slotDuration: "00:15:00",
        scrollTime: new Date().getHours() - 1 + ":00:00",
        events: [
          {
            title: "haha 1",
            start: "2022-12-02T16:00:00",
            end: "2022-12-02T16:18:00",
          },
          {
            title: "haha 2",
            start: "2022-12-02T21:00:00",
            end: "2022-12-02T22:53:13",
          },
        ],
      },
      eventSelected: null,
      editingSelected: false,
      currentEvents: this.fakeEvents,
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
    fetch('/api/categories')
      .then(response => response.json())
      .then(categories => {
        this.categories = categories.map(category => category.name);
        this.categoriesLoading = false;
      });
  },
  methods: {
    hmTime(date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    },
    handleDateSelect(selectionInfo) {
      const calendarApi = this.$refs.fullCalendar.getApi();

      this.eventSelected = calendarApi.addEvent({
        id: this.currentEvents.length + 1,
        title: "",
        start: selectionInfo.startStr,
        end: selectionInfo.endStr,
        allDay: selectionInfo.allDay,
      });
      this.editSelected();

      calendarApi.unselect();
    },
    handleEventClick(clickInfo) {
      if (this.eventSelected && this.eventSelected.id === clickInfo.event.id) {
        this.eventSelected = null;
      } else {
        this.eventSelected = clickInfo.event;
      }
    },
    handleEvents(events) {
      this.currentEvents = events;
    },
    editSelected() {
      this.editingSelected = true;
      this.eventDraft = {
        start: this.eventSelected.start,
        end: this.eventSelected.end,
      };
    },
    deleteSelected() {
      if (this.eventSelected) {
        this.eventSelected.remove();
        this.eventSelected = null;
      }
    },
    saveSelected() {
      this.eventSelected = null;
      this.editingSelected = null;
    },
    cancelSelected() {
      this.eventSelected = null;
    },
    updateEventSelected(update) {
      console.log(update);
      if (update.title) {
        this.eventSelected.setProp('title', update.title);
      }
    },
  },
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
  z-index: 1000;
  position: absolute;
  top: 50%;
  right: 1em;
}
</style>
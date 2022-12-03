<template>
  <FullCalendar :options="calendarOptions">
    <template v-slot:eventContent="arg">
      <b>{{ arg.timeText }}</b>
      <i>{{ arg.event.title }}</i>
    </template>
  </FullCalendar>
</template>

<script>
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  name: "DailyCalendar",
  components: {
    FullCalendar,
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
      },
      currentEvents: [],
    };
  },
  methods: {
    handleDateSelect(selectionInfo) {
      const calendarApi = selectionInfo.view.calendar;
      calendarApi.unselect(); // clear date selection
      let title = prompt("Please enter a new title for your event");
      if (title) {
        calendarApi.addEvent({
          id: this.currentEvents.length + 1,
          title,
          start: selectionInfo.startStr,
          end: selectionInfo.endStr,
          allDay: selectionInfo.allDay,
        });
      }
    },
    handleEventClick(clickInfo) {
      if (
        confirm(
          `Are you sure you want to delete the event '${clickInfo.event.title}'`
        )
      ) {
        clickInfo.event.remove();
      }
    },
    handleEvents(events) {
      this.currentEvents = events;
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
</style>
<template>
  <div>
    <h3>{{ $tc("contact.contact", 1) }}</h3>
    <b-table
      :items="eventContacts"
      :fields="eventFields"
      sort-by="event_info.date_start"
      sort-desc
      responsive="sm"
      @row-clicked="linkTo"
      @row-middle-clicked="linkToNewTab"
      hover
      small
    >
      <template v-slot:cell(type)="data">
        {{ getContactType(data.item.type) }}
      </template>
    </b-table>
  </div>
</template>

<script>
/**
 * Displays event contacts list for an athlete
 */

import contactType from "../mixins/ContactType";

export default {
  name: "AthleteEventContactList",
  mixins: [contactType],
  props: {
    eventContacts: Array
  },
  computed: {
    /**
     * Sets fields list for the results table
     *
     * @returns {array} fields list
     */
    eventFields: function () {
      return [
        {
          key: "event_info.date_start",
          label: this.$t("date"),
          sortable: true
        },
        {
          key: "event_info.name",
          label: this.$tc("event.event", 1),
          sortable: true,
          thClass: "d-none d-lg-table-cell",
          tdClass: "d-none d-lg-table-cell"
        },
        {
          key: "type",
          label: this.$tc("contact.type", 1),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell",
          sortable: true
        }
      ];
    }
  },
  methods: {
    /**
     * Routes to event information when row is clicked
     *
     * @param {object} item - competition object
     */
    linkTo(item) {
      this.$router.push({
        name: "event",
        params: { event_id: item.event }
      });
    },
    /**
     * Opens event information in new window when row is clicked
     *
     * @param {object} item - competition object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "event",
        params: { event_id: item.event }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped></style>

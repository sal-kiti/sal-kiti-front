<template>
  <div>
    <b-row>
      <b-col v-if="$store.state.editMode && createPermission">
        <b-button
          :to="{ name: 'event-create' }"
          variant="light"
          class="btn-orange float-right"
        >
          {{ $tc("event.add", 2) }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-alert v-if="errors.main" variant="danger" show>
          <ul>
            <li v-for="e in errors.main" v-bind:key="e">{{ e }}</li>
          </ul>
        </b-alert>
      </b-col>
    </b-row>
    <b-row v-if="!limited">
      <b-col>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectListed('future')"
          :pressed="!listFuture"
          :key="'past' + listFuture"
        >
          {{ $tc("event.past", 2) }}
        </b-button>
        <b-button
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectListed('future')"
          :pressed="listFuture"
          :key="'future' + listFuture"
        >
          {{ $tc("event.future", 2) }}
        </b-button>
        <b-button
          v-if="$store.state.user.is_authenticated"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectListed('applied')"
          :pressed="includeApplied"
          :key="'applied' + includeApplied"
        >
          {{ $tc("event.applied", 2) }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="events.count"
          :per-page="events.limit"
          align="right"
          v-if="events.count > events.limit && !limited"
        >
        </b-pagination>
        <b-table
          :fields="listFields"
          :items="events.results"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(date)="data">
            <div v-if="data.item.date_start === data.item.date_end">
              {{ data.item.date_start }}
            </div>
            <div v-else>
              {{ data.item.date_start }} - {{ data.item.date_end }}
            </div>
            <b-button
              v-if="$store.state.editMode && $store.state.user.is_staff"
              :to="{
                name: 'admin',
                params: {
                  model_name: 'event',
                  object_id: data.item.id
                }
              }"
              variant="light"
              class="btn-orange btn-sm"
              >{{ $t("admin") }}
            </b-button>
          </template>
          <template v-slot:cell(name)="data">
            {{ data.item.name }}
            <div>
              <ul>
                <li
                  v-for="competition in limitToPublic(data.item.competitions)"
                  v-bind:key="competition.id"
                >
                  {{ competition.type }}
                </li>
              </ul>
            </div>
          </template>
          <template v-slot:cell(approved)="data">
            <div v-if="data.item.approved">
              {{ $t("yes") }}
            </div>
            <div v-else>
              {{ $t("no") }}
            </div>
          </template>
        </b-table>
        <div v-show="loadingEvents">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays a list of events
 *
 * Optional add button if user has create permissions
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";

export default {
  name: "EventList",
  props: {
    limit: {
      type: Number,
      default: 25
    },
    limited: {
      type: Boolean,
      default: false
    },
    applied: {
      type: Boolean,
      default: false
    },
    future: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: 1,
      errors: {},
      events: [],
      includeApplied: this.applied,
      listFuture: this.future,
      loadingEvents: true,
      selectMode: "single"
    };
  },
  computed: {
    /**
     * Set create permission for authenticated users
     *
     * @returns {boolean} createPermission
     */
    createPermission: function () {
      try {
        return this.$store.state.user.is_authenticated;
      } catch (err) {
        return false;
      }
    },
    /**
     * Sets fields list for the event table
     *
     * @returns {array} fields list
     */
    listFields: function () {
      let fields = [
        { key: "date", label: this.$t("date") },
        { key: "name", label: this.$t("name") },
        { key: "organization_info.abbreviation", label: this.$t("organizer") }
      ];
      if (!this.limited) {
        fields.push({
          key: "location",
          label: this.$t("location"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        });
      }
      if (this.includeApplied) {
        fields.push({
          key: "approved",
          label: this.$t("event.approved"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        });
      }
      return fields;
    }
  },
  watch: {
    /**
     * Fetch new set of events on page change
     */
    currentPage: {
      handler: function () {
        this.getEvents();
      }
    }
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    /**
     * Fetch events from API
     * - remove future events if user does not have create permission
     *
     * @returns {Promise<void>}
     */
    async getEvents() {
      this.$set(this.errors, "main", null);
      this.loadingEvents = true;
      let searchUrl = "events/?limit=" + this.limit;
      let today = new Date().toJSON().slice(0, 10);
      if (this.listFuture) {
        searchUrl = searchUrl + "&start=" + today + "&ordering=date_start";
      } else {
        searchUrl = searchUrl + "&until=" + today + "&ordering=-date_start";
      }
      if (!this.includeApplied) {
        searchUrl = searchUrl + "&approved=true";
      }
      if (this.currentPage) {
        if (
          !this.events.count ||
          this.events.count <= (this.currentPage - 1) * this.limit
        ) {
          this.currentPage = 1;
        }
        searchUrl = searchUrl + "&page=" + this.currentPage;
      }
      HTTP.get(searchUrl)
        .then((response) => {
          this.events = response.data || [];
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingEvents = false));
    },
    /**
     * Limit array by public parameter
     *
     * @param {array} array - array of objects
     */
    limitToPublic(array) {
      if (Array.isArray(array)) {
        return array.filter((item) => item.public);
      }
      return [];
    },
    /**
     * Routes to event information when row is clicked
     *
     * @param {object} item - event object
     */
    linkTo(item) {
      this.$router.push({ name: "event", params: { event_id: item.id } });
    },
    /**
     * Opens event information in new window when row is clicked
     *
     * @param {object} item - event object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "event",
        params: { event_id: item.id }
      });
      window.open(routeData.href, "_blank");
    },
    /**
     * Opens event information in new window when row is clicked
     *
     * @param {object} item - event object
     */
    selectListed(item) {
      if (item === "future") {
        this.listFuture = !this.listFuture;
      }
      if (item === "applied") {
        this.includeApplied = !this.includeApplied;
        if (this.includeApplied) {
          this.listFuture = true;
        }
      }
      this.getEvents();
    }
  }
};
</script>

<style scoped></style>

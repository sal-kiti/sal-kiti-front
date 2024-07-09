<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ $t("info.info") }}</h1>
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
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("info.judge_lists") }}</h2>
      </b-col>
    </b-row>
    <b-row v-if="loadingSports">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <b-button
          v-for="sport in sports"
          v-bind:key="sport.id"
          :pressed.sync="sport.state"
          variant="light"
          class="btn-orange space-right space-down"
          v-on:click="selectSport(sport.id)"
        >
          {{ sport.name }}
        </b-button>
      </b-col>
    </b-row>
    <b-row v-if="results.results">
      <b-col>
        <h3 class="bg-sal-orange">{{ $tc("info.judge", 2) }}</h3>
        <b-pagination
          v-model="currentPage"
          :total-rows="results.count"
          :per-page="results.limit"
          align="right"
          v-if="results.count > results.limit"
        >
        </b-pagination>
        <p class="text-right" v-if="results.count">
          {{ $t("search.count") }}: {{ results.count }}
        </p>
        <b-table
          id="my-table"
          :fields="resultFields"
          :items="results.results"
          :current-page="currentPage"
          :per-page="0"
          @row-clicked="linkTo"
          @row-middle-clicked="linkToNewTab"
          hover
        >
          <template v-slot:cell(info)="data">
            <div v-for="merit in data.item.info" :key="merit.id">
              <div v-if="merit.type == 'merit'">
                {{ merit.value }}
              </div>
            </div>
          </template>
        </b-table>
        <div v-show="loadingAthletes">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Dispays sports information
 * - categories
 * - competition types
 */
import { HTTP } from "../api/BaseApi.js";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";

export default {
  name: "InfoJudge",
  mixins: [apiGet],
  data() {
    return {
      currentPage: 1,
      errors: {},
      limit: 100,
      loadingAthletes: false,
      loadingSports: false,
      results: [],
      sport: null,
      sports: []
    };
  },
  computed: {
    /**
     * Creates fields list for the judges list table
     *
     * @returns {array} fields list
     */
    resultFields: function () {
      return [
        { key: "sport_id", label: this.$t("athlete.sport_id") },
        { key: "first_name", label: this.$t("first_name") },
        { key: "last_name", label: this.$t("last_name") },
        { key: "info", label: this.$tc("info.merit", 2) },
        { key: "organization_info.name", label: this.$t("athlete.club") }
      ];
    }
  },
  watch: {
    /**
     * Recalculate search parameters if page changes
     */
    currentPage: {
      handler: function () {
        this.getAthletes(this.searchParams);
      }
    }
  },
  mounted() {
    if (this.$route.query) {
      this.parseQueryParams();
    }
    this.getSports();
    document.title =
      this.$tc("info.judge", 2) + " | " + this.$t("title.prefix");
  },
  methods: {
    /**
     * Fetch sports list from API
     *
     * @returns {Promise<void>}
     */
    async getSports() {
      this.loadingSports = true;
      HTTP.get("sports/")
        .then((response) => {
          this.sports = response.data.results;
          this.sports.forEach((obj) => {
            obj.state = false;
          });
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingSports = false));
    },
    /**
     * Fetch athletes from API
     *
     * @param {int} sportId
     * @returns {Promise<void>}
     */
    async getAthletes() {
      this.$set(this.errors, "main", null);
      this.loadingAthletes = true;
      if (this.currentPage) {
        if (
          !this.results.count ||
          this.results.count <= (this.currentPage - 1) * this.limit
        ) {
          this.currentPage = 1;
        }
      }
      HTTP.get(
        "athletes/?info=merit&sport=" +
          this.sport +
          "&limit=" +
          this.limit +
          "&page=" +
          this.currentPage
      )
        .then((response) => {
          this.results = response.data;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingAthletes = false));
    },
    /**
     * Routes to athlete information when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkTo(item) {
      this.$router.push({ name: "athlete", params: { athlete_id: item.id } });
    },
    /**
     * Opens athlete information in new window when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkToNewTab(item) {
      let routeData = this.$router.resolve({
        name: "athlete",
        params: { athlete_id: item.id }
      });
      window.open(routeData.href, "_blank");
    },
    /**
     * Parse sport from query parameters
     */
    parseQueryParams() {
      if (this.$route.query.sport) {
        this.selectSport(this.$route.query.sport);
      }
    },
    /**
     * Set sport
     * - trigger sport based API calls
     * - set router
     *
     * @param {number} id
     */
    selectSport(id) {
      this.$set(this.errors, "main", null);
      this.sport = id;
      this.sports.forEach((obj) => {
        if (obj.id !== id) {
          obj.state = false;
        }
      });
      this.getAthletes();
    }
  }
};
</script>

<style scoped></style>

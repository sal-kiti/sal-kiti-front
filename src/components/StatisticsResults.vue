<template>
  <div>
    <b-row>
      <b-col>
        <h3 v-if="header" class="bg-sal-orange">
          {{ $tc("result.result", 2) }}: {{ header }}
        </h3>
        <h3 v-else class="bg-sal-orange">{{ $tc("result.result", 2) }}</h3>
      </b-col>
    </b-row>
    <b-row v-if="description">
      <b-col>
        <p>{{ description }}</p>
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
        <b-pagination
          v-model="currentPage"
          :total-rows="results.count"
          :per-page="results.limit"
          align="right"
          v-if="results.count > results.limit"
        >
        </b-pagination>
        <p class="text-right" v-if="results.page">
          {{ $t("search.count") }}: {{ results.count }}
        </p>
        <b-table
          v-if="results.count > 0"
          small
          :fields="resultFields"
          :items="results.results"
        >
          <template v-slot:cell(number)="data">
            <div
              v-if="
                !results.results[data.index - 1] ||
                data.item.result !== results.results[data.index - 1].result
              "
            >
              <div
                v-if="
                  highlight &&
                  data.index +
                    1 +
                    results.limit * currentPage -
                    results.limit <=
                    highlight
                "
              >
                <span class="text-success">{{
                  data.index + 1 + results.limit * currentPage - results.limit
                }}</span>
              </div>
              <div v-else>
                {{
                  data.index + 1 + results.limit * currentPage - results.limit
                }}
              </div>
            </div>
          </template>
          <template v-slot:cell(athlete)="data">
            <div v-if="data.item.athlete">
              <router-link
                tag="a"
                :to="{
                  name: 'athlete',
                  params: { athlete_id: data.item.athlete.id }
                }"
              >
                {{ data.item.athlete.first_name }}
                {{ data.item.athlete.last_name }}
              </router-link>
            </div>
            <div v-else>
              {{ $t("team") }}: {{ data.item.last_name }}
              <ul>
                <li v-for="member in data.item.team_members" :key="member.id">
                  <router-link
                    tag="a"
                    :to="{
                      name: 'athlete',
                      params: { athlete_id: member.id }
                    }"
                  >
                    {{ member.first_name }} {{ member.last_name }}
                  </router-link>
                </li>
              </ul>
            </div>
          </template>
          <template v-slot:cell(result)="data">
            {{ data.item.result | roundValue(data.item.decimals) }}
            <span v-if="groupResults && groupResults > 1"
              >({{ data.item.result | divideValue(groupResults, 3) }})</span
            >
          </template>
          <template v-slot:cell(competition)="data">
            <router-link
              tag="a"
              :to="{
                name: 'competition',
                params: { competition_id: data.item.competition.id }
              }"
            >
              {{ data.item.competition.name }}
            </router-link>
          </template>
          <template v-slot:cell(date)="data">
            <div
              v-if="
                data.item.competition.date_start ===
                data.item.competition.date_end
              "
            >
              {{ data.item.competition.date_start }}
            </div>
            <div v-else>
              {{ data.item.competition.date_start }} -
              {{ data.item.competition.date_end }}
            </div>
          </template>
        </b-table>
        <div v-show="loadingResults">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { HTTP } from "../api/BaseApi.js";
import roundValue from "../utils/RoundValueFilter";
import errorParser from "../utils/ErrorParser";

export default {
  name: "StatisticsResults",
  filters: {
    roundValue,
    divideValue: function (value, divide, decimals) {
      const val = parseFloat(value);
      if (!val || isNaN(val)) return "";
      return (val / divide).toFixed(decimals);
    }
  },
  props: {
    description: {
      type: String,
      default: null
    },
    header: {
      type: String,
      default: null
    },
    highlight: {
      type: Number,
      default: null
    },
    searchParameters: String
  },
  data() {
    return {
      currentPage: 1,
      errors: {},
      loadingResults: false,
      results: []
    };
  },
  computed: {
    /**
     * Parse group_results from search URL parameters
     *
     * @returns {string} group_result
     */
    groupResults: function () {
      let urlParams = new URLSearchParams(this.searchParameters);
      return urlParams.get("group_results");
    },
    /**
     * Sets fields list for the statistics list
     *
     * @returns {array} fields list
     */
    resultFields: function () {
      let groupResult = this.searchParameters.includes("group_results");
      let fields = [
        { key: "number", label: "#" },
        { key: "athlete", label: this.$tc("athlete.athlete", 1) }
      ];
      if (!groupResult) {
        fields.push({
          key: "organization",
          label: this.$t("athlete.club"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        });
        fields.push({ key: "category", label: this.$t("result.category") });
      }
      if (groupResult) {
        fields.push({
          key: "athlete.organization_info.abbreviation",
          label: this.$tc("athlete.club", 1)
        });
      }
      fields.push({ key: "result", label: this.$tc("result.result", 1) });
      if (!groupResult) {
        fields.push({
          key: "competition.type_info.abbreviation",
          label: this.$t("competition.type")
        });
        fields.push({
          key: "competition.level_info.abbreviation",
          label: this.$t("competition.level"),
          thClass: "d-none d-md-table-cell",
          tdClass: "d-none d-md-table-cell"
        });
        fields.push({
          key: "competition",
          label: this.$tc("competition.competition", 1),
          thClass: "d-none d-lg-table-cell",
          tdClass: "d-none d-lg-table-cell"
        });
        fields.push({
          key: "date",
          label: this.$t("date"),
          thClass: "d-none d-lg-table-cell",
          tdClass: "d-none d-lg-table-cell"
        });
      }
      return fields;
    }
  },
  watch: {
    /**
     * Update results on page change
     */
    currentPage: {
      handler: function () {
        this.getStatistics();
      }
    },
    /**
     * Trigger search on parameters change
     */
    searchParameters: {
      handler: function () {
        this.currentPage = 1;
        this.getStatistics();
      }
    }
  },
  mounted() {
    this.getStatistics();
  },
  methods: {
    /**
     * Fetch statistics from API
     *
     * @returns {Promise<void>}
     */
    async getStatistics() {
      if (this.currentPage) {
        if (
          !this.results.count ||
          this.results.count <= (this.currentPage - 1) * this.limit
        ) {
          this.currentPage = 1;
        }
      }
      this.loadingResults = true;
      this.results = [];
      this.$set(this.errors, "main", null);
      HTTP.get(
        "resultlist/" + this.searchParameters + "&page=" + this.currentPage
      )
        .then((response) => {
          this.results = response.data || [];
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.loadingResults = false));
    }
  }
};
</script>

<style scoped></style>

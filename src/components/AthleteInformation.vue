<template>
  <div>
    <b-row>
      <b-col>
        <h1>{{ athlete.first_name }} {{ athlete.last_name }}</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange">{{ $t("athlete.info") }}</h2>
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
    <b-row v-if="loadingAthlete">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("first_name") }}</dt>
          <dd v-if="athlete.first_name">{{ athlete.first_name }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("last_name") }}</dt>
          <dd v-if="athlete.last_name">{{ athlete.last_name }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("athlete.sport_id") }}</dt>
          <dd v-if="athlete.sport_id">{{ athlete.sport_id }}</dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3">
        <dl>
          <dt>{{ $t("athlete.club") }}</dt>
          <dd v-if="athlete.organization_info">
            {{ athlete.organization_info.name }}
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3" v-if="licences.length">
        <dl>
          <dt>{{ $t("athlete.licences") }}</dt>
          <dd v-for="info in licences" v-bind:key="info.id">
            {{ info.value }}
          </dd>
        </dl>
      </b-col>
      <b-col cols="6" md="3" v-if="merits.length">
        <dl>
          <dt>{{ $t("athlete.merits") }}</dt>
          <dd v-for="info in merits" v-bind:key="info.id">
            {{ info.value }}
          </dd>
        </dl>
      </b-col>
      <b-col
        cols="6"
        md="3"
        v-if="$store.state.editMode && $store.state.user.is_staff && athlete"
      >
        <dl>
          <dt>{{ $t("admin") }}</dt>
          <dd>
            <b-button
              :to="{
                name: 'admin',
                params: {
                  model_name: 'athlete',
                  object_id: athlete.id
                }
              }"
              variant="light"
              class="btn-orange btn-sm"
              >{{ $t("admin") }}
            </b-button>
          </dd>
        </dl>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Displays basic information for a single athlete
 */
import apiGet from "../mixins/ApiGet";

export default {
  name: "AthleteInformation",
  mixins: [apiGet],
  data() {
    return {
      athlete: {},
      errors: {},
      loadingAthlete: true
    };
  },
  computed: {
    licences: function () {
      if (!this.athlete || !this.athlete.info) {
        return [];
      }
      return this.athlete.info.filter((f) => f.type === "licence");
    },
    merits: function () {
      if (!this.athlete || !this.athlete.info) {
        return [];
      }
      return this.athlete.info.filter((f) => f.type === "merit");
    }
  },
  mounted() {
    this.getAthlete(this.$route.params.athlete_id);
  }
};
</script>

<style scoped></style>

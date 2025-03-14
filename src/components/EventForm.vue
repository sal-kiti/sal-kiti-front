<template>
  <div>
    <b-row>
      <b-col>
        <h1 v-if="edit">{{ event.name }}</h1>
        <h1 v-else>{{ $tc("event.event", 2) }}</h1>
      </b-col>
      <b-col v-if="edit">
        <b-button
          :to="{
            name: 'event',
            params: {
              event_id: eventId
            }
          }"
          variant="light"
          class="btn-orange float-right"
        >
          {{ $tc("event.return", 2) }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h2 class="bg-sal-orange" v-if="edit">{{ $t("event.edit") }}</h2>
        <h2 class="bg-sal-orange" v-else>{{ $t("event.add") }}</h2>
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
    <b-row v-if="loadingEvent">
      <b-col>
        <b-spinner label="Loading..."></b-spinner>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form @submit="onSubmit">
          <b-form-group
            id="input-group-organization"
            :label="$t('organizer')"
            label-for="input-organization"
            :invalid-feedback="$t('required')"
            :state="event.organization != null"
          >
            <b-form-select
              id="input-organization"
              v-model="event.organization"
              :options="organizations"
              textField="name"
              valueField="id"
              required
            >
            </b-form-select>
            <b-form-invalid-feedback :state="(!'organization') in errors">
              <ul>
                <li v-for="e in errors.organization" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-name"
            :label="$t('name')"
            label-for="input-name"
            :invalid-feedback="$t('required')"
            :state="event.name != null && event.name.length > 0"
          >
            <b-form-input
              id="input-name"
              v-model="event.name"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'name') in errors">
              <ul>
                <li v-for="e in errors.name" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-description"
            :label="$t('description')"
            label-for="input-description"
            :description="$t('event.description_help')"
          >
            <b-form-textarea
              id="input-description"
              v-model="event.description"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            <b-form-invalid-feedback :state="(!'description') in errors">
              <ul>
                <li v-for="e in errors.description" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-location"
            :label="$t('location')"
            label-for="input-location"
            :invalid-feedback="$t('required')"
            :state="event.location != null && event.location.length > 0"
          >
            <b-form-input
              id="input-location"
              v-model="event.location"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'location') in errors">
              <ul>
                <li v-for="e in errors.location" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-date-start"
            :label="$t('date_start')"
            label-for="input-date-start"
            :invalid-feedback="$t('required')"
            :state="event.date_start != null && event.date_start.length > 0"
          >
            <b-form-input
              id="input-date-start"
              v-model="event.date_start"
              type="date"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'date_start') in errors">
              <ul>
                <li v-for="e in errors.date_start" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-date-end"
            :label="$t('date_end')"
            label-for="input-date-end"
            :invalid-feedback="$t('required')"
            :state="event.date_end != null && event.date_end.length > 0"
          >
            <b-form-input
              id="input-date-end"
              v-model="event.date_end"
              type="date"
              required
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'date_end') in errors">
              <ul>
                <li v-for="e in errors.date_end" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-categories"
            :label="$t('event.categories')"
            label-for="input-categories"
            :description="$t('event.categories_help')"
          >
            <b-form-textarea
              id="input-categories"
              v-model="event.categories"
              rows="3"
              max-rows="6"
            >
            </b-form-textarea>
            <b-form-invalid-feedback :state="(!'categories') in errors">
              <ul>
                <li v-for="e in errors.categories" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-web_page"
            :label="$t('event.web_page')"
            label-for="input-web_page"
            :description="$t('event.web_page_help')"
          >
            <b-form-input id="input-web_page" v-model="event.web_page">
            </b-form-input>
            <b-form-invalid-feedback :state="(!'web_page') in errors">
              <ul>
                <li v-for="e in errors.web_page" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-invitation"
            :label="$t('event.invitation')"
            label-for="input-invitation"
            :description="$t('event.invitation_help')"
          >
            <b-form-input id="input-invitation" v-model="event.invitation">
            </b-form-input>
            <b-form-invalid-feedback :state="(!'invitation') in errors">
              <ul>
                <li v-for="e in errors.invitation" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-safety_plan"
            :label="$t('event.safety_plan')"
            label-for="input-safety_plan"
            :description="$t('event.safety_plan_help')"
          >
            <b-form-checkbox id="input-safety_plan" v-model="event.safety_plan">
            </b-form-checkbox>
            <b-form-invalid-feedback :state="(!'safety_plan') in errors">
              <ul>
                <li v-for="e in errors.safety_plan" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-notes"
            :label="$t('event.notes')"
            label-for="input-notes"
            :description="$t('event.notes_help')"
          >
            <b-form-textarea
              id="input-notes"
              v-model="event.notes"
              rows="3"
              max-rows="6"
            >
            </b-form-textarea>
            <b-form-invalid-feedback :state="(!'notes') in errors">
              <ul>
                <li v-for="e in errors.notes" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <div>
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right"
            >
              <section v-if="edit">{{ $t("update") }}</section>
              <section v-else>{{ $t("event.move_to_contacts") }}</section>
            </b-button>
          </div>
          <br />
        </b-form>
      </b-col>
    </b-row>
    <b-row ref="eventContacts">
      <b-col>
        <EventFormContacts v-if="eventId" :eventId="eventId" :edit="true" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
/**
 * Event create and edit form
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";
import apiGet from "../mixins/ApiGet";
import EventFormContacts from "@/components/EventFormContacts.vue";

export default {
  name: "EventForm",
  mixins: [apiGet],
  components: {
    EventFormContacts
  },
  data() {
    return {
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      edit: false,
      errors: {},
      eventId: null,
      event: {
        date_end: null,
        date_start: null,
        location: null,
        name: null,
        description: "",
        organization: null,
        categories: "",
        notes: "",
        web_page: "",
        invitation: "",
        safety_plan: false,
        toc_agreement: true
      },
      loadingEvent: false,
      loadingOrganizations: false,
      organizations: []
    };
  },
  mounted() {
    this.getOrganizations(true, false, true);
    if (this.$route.params.event_id) {
      this.edit = true;
      this.getEvent(this.$route.params.event_id);
      this.eventId = parseInt(this.$route.params.event_id);
    }
    if (this.$route.query && this.$route.query.newEvent) {
      setTimeout(() => {
        this.$refs["eventContacts"].scrollIntoView();
      }, 500);
    }
  },
  methods: {
    /**
     * Create or edit event
     *
     * @param evt
     */
    onSubmit(evt) {
      evt.preventDefault();
      if (this.$route.params.event_id) {
        this.putEvent(this.$route.params.event_id);
      } else {
        this.postEvent();
      }
    },
    /**
     * Create a new event
     *
     * @returns {Promise<void>}
     */
    async postEvent() {
      this.error = {};
      this.event.toc_agreement = true;
      HTTP.post("events/", this.event, this.config)
        .then((response) => {
          this.$router.push({
            name: "event-update",
            params: { event_id: response.data.id.toString() },
            query: { newEvent: true }
          });
        })
        .catch((error) => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Edit event
     *
     * @param {number} id
     * @returns {Promise<void>}
     */
    async putEvent(id) {
      this.error = {};
      this.event.toc_agreement = true;
      HTTP.put("events/" + id + "/", this.event, this.config)
        .then((response) => {
          this.$router.push({
            name: "event",
            params: { event_id: response.data.id.toString() }
          });
        })
        .catch((error) => {
          this.errors = errorParser.form.bind(this)(error);
        });
    }
  }
};
</script>

<style scoped></style>

<template>
  <div>
    <b-row v-if="contacts.length > 0 || edit">
      <b-col>
        <h3 class="bg-sal-orange">{{ $tc("contact.contact", 2) }}</h3>
      </b-col>
    </b-row>
    <b-row v-if="contacts.length > 0 || edit">
      <b-col>
        <p>{{ $t("contact.contact_info") }}</p>
      </b-col>
    </b-row>
    <b-row v-if="contacts.length > 0">
      <b-col>
        <div>
          <b-table
            small
            :fields="contactFields"
            :items="contacts"
            sort-by="type"
            @row-clicked="linkToAthlete"
            @row-middle-clicked="linkToAthleteNewTab"
            hover
          >
            <template v-slot:cell(type)="data">
              {{ getContactType(data.item.type) }}
            </template>
            <template v-slot:cell(name)="data">
              {{ data.item.first_name }} {{ data.item.last_name }}
              <div v-if="data.item.athlete_info">
                {{ $t("athlete.sport_id") }}:
                {{ data.item.athlete_info.sport_id }}
              </div>
            </template>
            <template v-slot:cell(contact)="data">
              <div v-if="data.item.email">
                {{ data.item.email }}
              </div>
              <div v-if="data.item.phone">
                {{ data.item.phone }}
              </div>
            </template>
            <template v-slot:cell(info)="data">
              <div v-if="data.item.athlete_info">
                <div
                  v-for="merit in data.item.athlete_info.info"
                  :key="merit.id"
                >
                  <div v-if="merit.type === 'merit'">
                    {{ merit.value }}
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:cell(remove)="data">
              <div>
                <b-button
                  class="btn-danger"
                  v-on:click="deleteConfirm(data.item)"
                >
                  {{ $t("remove") }}
                </b-button>
              </div>
            </template>
          </b-table>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="edit">
      <b-col>
        <h4 class="bg-sal-orange">{{ $t("contact.add") }}</h4>
      </b-col>
    </b-row>
    <b-row v-if="edit">
      <b-col>
        <b-form @submit="onSearch" inline>
          <b-form-input
            type="text"
            class="search-field space-right space-down"
            :aria-label="$t('search.placeholder_athlete')"
            :placeholder="$t('search.placeholder_athlete')"
            v-model.lazy="athleteSearch.searchText"
          />
          <b-form-select
            class="search-field space-right space-down"
            v-model.lazy="athleteSearch.sport"
            :aria-label="$tc('sport.sport', 1)"
          >
            <option key="none" value=""></option>
            <option v-for="sport in sports" :key="sport.name" :value="sport.id">
              {{ sport.name }}
            </option>
          </b-form-select>
          <b-button
            type="submit"
            variant="light"
            class="btn-orange space-right space-down"
            >{{ $t("search.search") }}</b-button
          >
        </b-form>
      </b-col>
    </b-row>
    <b-row v-if="edit">
      <b-col>
        <p>{{ $t("contact.search_info") }}</p>
      </b-col>
    </b-row>
    <b-row v-if="searchParams">
      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="athleteSearch.results.count"
          :per-page="athleteSearch.results.limit"
          align="right"
          v-if="athleteSearch.results.count > athleteSearch.results.limit"
        >
        </b-pagination>
        <p class="text-right" v-if="athleteSearch.results.count">
          {{ $t("search.count") }}: {{ athleteSearch.results.count }}
        </p>
        <b-table
          id="my-table"
          :fields="athleteFields"
          :items="athleteSearch.results.results"
          :current-page="currentPage"
          :per-page="0"
          @row-clicked="selectAthlete"
          hover
        >
          <template v-slot:cell(info)="data">
            <div v-for="merit in data.item.info" :key="merit.id">
              <div v-if="merit.type === 'merit'">
                {{ merit.value }}
              </div>
            </div>
          </template>
        </b-table>
        <div v-show="athleteSearch.loadingAthletes">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="edit">
      <b-col>
        <h5 class="bg-sal-orange">{{ $t("contact.details") }}</h5>
      </b-col>
    </b-row>
    <b-form v-if="edit">
      <b-row>
        <b-col>
          <b-form-group
            :id="'contact-add-type'"
            :label="$t('contact.type')"
            label-for="input-type"
          >
            <b-form-select
              id="input-type"
              v-model="addContact.type"
              :options="contactTypes"
              textField="name"
              valueField="key"
              required
            ></b-form-select>
            <b-form-invalid-feedback :state="(!'type') in errors">
              <ul>
                <li v-for="e in errors.type" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :id="'contact-add-sport_id'"
            :label="$t('athlete.sport_id')"
            label-for="input-ct-sport_id"
            :hidden="!athlete.id"
          >
            <b-form-input
              id="input-ct-sport_id"
              v-model="athlete.sport_id"
              required
              :disabled="Object.keys(athlete).length > 0"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :id="'contact-add-first-name'"
            :label="$t('contact.first_name')"
            label-for="input-ct-first_name"
          >
            <b-form-input
              id="input-ct-first_name"
              v-model="addContact.first_name"
              required
              :disabled="Object.keys(athlete).length > 0"
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'first_name') in errors">
              <ul>
                <li v-for="e in errors.first_name" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :id="'contact-add-last-name'"
            :label="$t('contact.last_name')"
            label-for="input-ct-last_name"
          >
            <b-form-input
              id="input-ct-last_name"
              v-model="addContact.last_name"
              required
              :disabled="Object.keys(athlete).length > 0"
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'last_name') in errors">
              <ul>
                <li v-for="e in errors.last_name" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :id="'contact-add-email'"
            :label="$t('contact.email')"
            label-for="input-ct-email"
          >
            <b-form-input
              id="input-ct-email"
              v-model="addContact.email"
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'email') in errors">
              <ul>
                <li v-for="e in errors.email" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :id="'contact-add-phone'"
            :label="$t('contact.phone')"
            label-for="input-ct-phone"
          >
            <b-form-input
              id="input-ct-phone"
              v-model="addContact.phone"
            ></b-form-input>
            <b-form-invalid-feedback :state="(!'phone') in errors">
              <ul>
                <li v-for="e in errors.phone" v-bind:key="e">{{ e }}</li>
              </ul>
            </b-form-invalid-feedback>
          </b-form-group>
          <div>
            <b-button
              type="submit"
              variant="light"
              class="btn-orange space-right mb-5"
              v-on:click="postContact(addContact)"
            >
              {{ $t("create") }}
            </b-button>
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
              {{ $tc("event.continue_to_competitions", 2) }}
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
/**
 * Event create and edit form
 */
import { HTTP } from "../api/BaseApi.js";
import getCookie from "../utils/GetCookie";
import errorParser from "../utils/ErrorParser";

export default {
  name: "EventFormContacts",
  props: {
    eventId: Number,
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      athlete: {},
      config: {
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      },
      contacts: [],
      currentPage: 1,
      errors: {},
      searchParams: "",
      sports: [],
      addContact: {
        event: this.eventId.toString(),
        type: null,
        athlete: null,
        first_name: null,
        last_name: null,
        email: "",
        phone: ""
      },
      athleteSearch: {
        searchText: "",
        limit: 20,
        loadingAthletes: false,
        results: [],
        sport: null
      }
    };
  },
  computed: {
    /**
     * Creates fields list for the athletes list table
     *
     * @returns {array} fields list
     */
    athleteFields: function () {
      return [
        { key: "sport_id", label: this.$t("athlete.sport_id") },
        { key: "first_name", label: this.$t("first_name") },
        { key: "last_name", label: this.$t("last_name") },
        { key: "info", label: this.$tc("info.merit", 2) },
        { key: "organization_info.name", label: this.$t("athlete.club") }
      ];
    },
    /**
     * Sets fields list for the contacts table
     *
     * @returns {array} fields list
     */
    contactFields: function () {
      let fields = [
        { key: "type", label: this.$t("contact.type"), sortable: true },
        {
          key: "name",
          label: this.$t("name")
        },
        { key: "contact", label: this.$tc("contact.contact", 2) },
        { key: "info", label: this.$tc("info.merit", 2) }
      ];
      if (this.edit) {
        fields.push({ key: "remove", label: this.$t("remove") });
      }
      return fields;
    },
    contactTypes: function () {
      return [
        { key: "contact", name: this.$t("contact.generic_contact") },
        { key: "manager", name: this.$t("contact.competition_manager") },
        { key: "chiefrange", name: this.$t("contact.chief_range_officer") },
        { key: "technical", name: this.$t("contact.technical_manager") }
      ];
    }
  },
  watch: {
    /**
     * Recalculate search parameters if page changes
     */
    currentPage: {
      handler: function () {
        if (this.searchParams) {
          this.getAthletes(this.searchParams);
        }
      }
    },
    /**
     * Fetch athletes when search parameters change
     */
    searchParams: {
      handler: function () {
        this.currentPage = 1;
        if (this.searchParams) {
          this.getAthletes(this.searchParams);
        }
      }
    }
  },
  mounted() {
    this.getContacts(this.eventId);
    this.getSports();
  },
  methods: {
    /**
     * Fetch athletes from API
     *
     * @param {string} searchParams
     * @returns {Promise<void>}
     */
    async getAthletes(searchParams) {
      this.$set(this.errors, "main", null);
      this.athleteSearch.loadingAthletes = true;
      if (this.currentPage) {
        if (
          !this.athleteSearch.results.count ||
          this.athleteSearch.results.count <=
            (this.currentPage - 1) * this.athleteSearch.limit
        ) {
          this.currentPage = 1;
        }
      }
      HTTP.get(
        "athletes/" +
          searchParams +
          "&limit=" +
          this.athleteSearch.limit +
          "&page=" +
          this.currentPage
      )
        .then((response) => {
          this.athleteSearch.results = response.data;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        })
        .finally(() => (this.athleteSearch.loadingAthletes = false));
    },
    /**
     * Fetch contacts from API
     * @returns {Promise<void>}
     */
    async getContacts(eventId) {
      HTTP.get("eventcontacts/?event=" + eventId.toString())
        .then((response) => {
          this.contacts = response.data.results;
        })
        .catch((error) => {
          this.$set(this.errors, "main", errorParser.generic.bind(this)(error));
        });
    },
    /**
     * Returns a translated contact type name
     *
     * @param {string} key
     * @returns {string} name, or key if key not found
     */
    getContactType(key) {
      let contactType = this.contactTypes.filter((ct) => ct.key === key);
      if (contactType.length === 1) {
        return contactType[0].name;
      } else {
        return key;
      }
    },
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
     * Add a new event contact (API post)
     *
     * @param {object} contact
     * @returns {Promise<void>}
     */
    async postContact(contact) {
      this.errors = {};
      HTTP.post("eventcontacts/", contact, this.config)
        .then((response) => {
          if (response.status === 201) {
            this.resetFields();
            this.getContacts(this.eventId);
          }
        })
        .catch((error) => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Confirmation message for contact deletion
     *
     * @param {object} contact
     */
    deleteConfirm(contact) {
      this.$bvModal
        .msgBoxConfirm(this.$t("confirm.delete"), {
          okTitle: this.$t("confirm.yes"),
          cancelTitle: this.$t("confirm.cancel")
        })
        .then((value) => {
          if (value === true) {
            this.deleteContact(contact);
          }
        });
    },
    /**
     * Deletes the event contact (API delete)
     *
     * @param {object} contact
     */
    async deleteContact(contact) {
      this.errors = {};
      HTTP.delete("eventcontacts/" + contact.id + "/", this.config)
        .then((response) => {
          if (response.status === 204) {
            this.getContacts(this.eventId);
          }
        })
        .catch((error) => {
          this.errors = errorParser.form.bind(this)(error);
        });
    },
    /**
     * Reset all fields to original values
     */
    resetFields() {
      this.athlete = {};
      this.currentPage = 1;
      this.searchParams = "";
      this.addContact = {
        event: this.eventId.toString(),
        type: null,
        athlete: null,
        first_name: null,
        last_name: null,
        email: "",
        phone: ""
      };
      this.athleteSearch = {
        searchText: "",
        limit: 20,
        loadingAthletes: false,
        results: [],
        sport: null
      };
    },
    /**
     * Calculates search parameters and sets route
     *
     * @param evt
     */
    onSearch(evt) {
      if (evt) {
        evt.preventDefault();
      }
      this.searchParams = "?search=" + this.athleteSearch.searchText;
      if (this.athleteSearch.sport) {
        this.searchParams =
          this.searchParams + "&info=merit&sport=" + this.athleteSearch.sport;
      }
    },
    /**
     * Routes to athlete information when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkToAthlete(item) {
      if (item.athlete) {
        this.$router.push({
          name: "athlete",
          params: { athlete_id: item.athlete }
        });
      }
    },
    /**
     * Opens athlete information in new window when row is clicked
     *
     * @param {object} item - athlete object
     */
    linkToAthleteNewTab(item) {
      if (item.athlete) {
        let routeData = this.$router.resolve({
          name: "athlete",
          params: { athlete_id: item.athlete }
        });
        window.open(routeData.href, "_blank");
      }
    },
    /**
     * Sets form data when athlete is selected
     *
     * @param {object} item - athlete object
     */
    selectAthlete(item) {
      this.athlete = item;
      this.addContact.athlete = item.id;
      this.addContact.first_name = item.first_name;
      this.addContact.last_name = item.last_name;
      this.searchParams = "";
      this.athleteSearch.searchText = "";
      this.athleteSearch.sport = null;
    }
  }
};
</script>

<style scoped></style>

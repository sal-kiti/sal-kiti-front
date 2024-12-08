export default {
  computed: {
    /**
     * Retruns a list of contact types
     *
     * @returns {array} fields list
     */
    contactTypes: function () {
      return [
        { key: "contact", name: this.$t("contact.generic_contact") },
        { key: "manager", name: this.$t("contact.competition_manager") },
        { key: "chiefrange", name: this.$t("contact.chief_range_officer") },
        { key: "technical", name: this.$t("contact.technical_manager") },
        { key: "range", name: this.$t("contact.range_officer") }
      ];
    }
  },
  methods: {
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
    }
  }
};

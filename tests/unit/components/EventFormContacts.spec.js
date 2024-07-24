import { createLocalVue, mount } from "@vue/test-utils";
import EventFormContacts from "@/components/EventFormContacts.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

const $router = {
  push: jest.fn()
};

describe("EventFormContacts.vue", () => {
  it("renders event contacts with form", async () => {
    const $route = {
      params: { event_id: 1 }
    };
    const wrapper = mount(EventFormContacts, {
      localVue,
      propsData: {
        eventId: 1,
        edit: true
      },
      mocks: {
        $route,
        $router
      }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });
});

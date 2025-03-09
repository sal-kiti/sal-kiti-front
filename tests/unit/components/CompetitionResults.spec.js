import {
  createLocalVue,
  RouterLinkStub,
  mount,
  shallowMount
} from "@vue/test-utils";
import flushPromises from "flush-promises";
import CompetitionResults from "@/components/CompetitionResults.vue";
import BootstrapVue from "bootstrap-vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Vuex);

let state = { editMode: false, user: { is_authenticated: false } };
let store = new Vuex.Store({ state });

describe("CompetitionResults.vue", () => {
  it("renders result list", async () => {
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = mount(CompetitionResults, {
      localVue,
      store,
      mocks: {
        $route
      },
      propsData: {
        competition: {
          id: 1,
          type: 1,
          layout: 1
        },
        editPermission: false
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for staff", async () => {
    state = {
      editMode: true,
      user: {
        is_authenticated: true,
        is_staff: true,
        is_superuser: false,
        area_manager: [0],
        sport_manager: []
      }
    };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = mount(CompetitionResults, {
      localVue,
      store,
      mocks: {
        $route
      },
      propsData: {
        competition: {
          id: 1,
          type: 1,
          layout: 1
        },
        editPermission: false
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for area managers", async () => {
    state = {
      editMode: true,
      user: {
        is_authenticated: true,
        is_staff: false,
        is_superuser: false,
        area_manager: [1],
        sport_manager: []
      }
    };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = mount(CompetitionResults, {
      localVue,
      store,
      mocks: {
        $route
      },
      propsData: {
        competition: {
          id: 1,
          type: 1,
          organization: 1,
          layout: 1
        },
        editPermission: false
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("show management options for sport managers", async () => {
    state = {
      editMode: true,
      user: {
        is_authenticated: true,
        is_staff: false,
        is_superuser: false,
        area_manager: [0],
        sport_manager: [1]
      }
    };
    store = new Vuex.Store({ state });
    const $route = {
      params: { competition_id: 1 }
    };
    const wrapper = mount(CompetitionResults, {
      localVue,
      store,
      mocks: {
        $route
      },
      propsData: {
        competition: {
          id: 1,
          type: 1,
          type_info: { sport: 1 },
          layout: 1
        },
        editPermission: false
      },
      stubs: { "router-link": RouterLinkStub }
    });
    await flushPromises();
    expect(wrapper.element).toMatchSnapshot();
  });

  it("render error message on error", async () => {
    const $route = {
      params: { competition_id: 99 }
    };
    const wrapper = shallowMount(CompetitionResults, {
      localVue,
      store,
      propsData: {
        competition: {
          id: 99,
          type: 1,
          layout: 1
        },
        editPermission: false
      },
      mocks: {
        $route
      }
    });
    await flushPromises();
    expect(wrapper.text()).toContain("import.error.unknown");
  });
});

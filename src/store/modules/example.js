/**
 * Пример модуля VueX
 */

//import ExampleService from "@/middleware/services/ExampleService";
import VuexModule from "../VuexModule";

const ExampleModule = new VuexModule({
  initialState: () => ({
    examples: [],
  }),
  
  mutations: {
    SET_EXAMPLES: (state, examples) => state.examples = examples,
  },
  
  actions: {
    async loadExamples({ commit }) {
      const examples = (await ExampleService.loadExamples()).data;
      commit('SET_EXAMPLES', examples);
      return { error: false };
    }
  },
  
  getters: {
    getExamples: state => state.examples,
  },
});

export default ExampleModule;

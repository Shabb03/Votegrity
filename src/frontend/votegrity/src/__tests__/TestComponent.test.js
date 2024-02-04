import { mount } from "@vue/test-utils";
import NavigationBar from "@/components/navbar/NavigationBar.vue";

describe("NavigationBar", () => {
  it("renders properly", () => {
    const wrapper = mount(NavigationBar);
    //expect(wrapper.html()).toMatchSnapshot();
  });
});

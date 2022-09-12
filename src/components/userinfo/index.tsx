import { defineComponent } from "vue";
import Avatar from "/@/components/avatar";
import "./index.css"

export default defineComponent({
  name: "UserInfo",
  props: {
    userInfo: Object
  },
  setup(props) {
    return () => (
      <>
        <div class="flex justify-between">
          <div class="">
            <Avatar />
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex justify-between px-2">
              <div class="text-2xl text-gray-600 font-bold">Maiiiiiid</div>
              <i></i>
            </div>
            <div class="flex justify-between">
              <div class="info-text-container">
                <div class="info-text-num">304</div>
                <div class="info-text-name">Memos</div>
              </div>
              <div class="info-text-container">
                <div class="info-text-num">34</div>
                <div class="info-text-name">Tags</div>
              </div>
              <div class="info-text-container">
                <div class="info-text-num">304</div>
                <div class="info-text-name">Days</div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
})
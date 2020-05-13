import Vue from "vue";
import AdminApp from "../component/AdminApp.vue";
import Panel from "../component/Panel.vue";
import SplitPanel from "../component/SplitPanel.vue";
import FormEditor from "../component/FormEditor.vue";
import ListEditor from "../component/ListEditor.vue";
import TreeEditor from "../component/TreeEditor.vue";
import DataTable from "../component/DataTable.vue";
import * as appHelper from '../utils/helper'

Vue.prototype.$appHelper = appHelper

// we globally register our component
Vue.component("admin-app", AdminApp);
Vue.component("panel", Panel);
Vue.component("split-panel", SplitPanel);
Vue.component("list-editor", ListEditor);
Vue.component("form-editor", FormEditor);
Vue.component("tree-editor", TreeEditor);
Vue.component("data-table", DataTable);
Vue.component("input-cron", InputCron);

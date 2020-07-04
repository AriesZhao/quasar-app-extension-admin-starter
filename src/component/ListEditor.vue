<template>
  <split-panel v-bind="$props">
    <template slot="right-actions">
      <div class="q-gutter-sm">
        <q-btn
          label="新建"
          color="secondary"
          v-if="creatable && (status === 'view' || status === 'blank')"
          @click="create"
        />
        <q-btn
          label="保存"
          color="primary"
          v-if="status === 'create' || status === 'edit'"
          @click="saveItem"
        />
        <q-btn
          label="编辑"
          color="primary"
          v-if="editable && status === 'view'"
          @click="edit"
        />
        <q-btn
          label="删除"
          color="negative"
          v-if="removable && status === 'view'"
          @click="remove"
        />
        <q-btn
          label="取消"
          color="secondary"
          v-if="status === 'edit' || status === 'create'"
          @click="cancel"
        />
      </div>
    </template>

    <template slot="left">
      <q-list separator>
        <q-item
          v-for="item in itemList"
          :key="item[itemKey]"
          :clickable="readonly"
          :v-ripple="readonly"
          @click="choose(item)"
        >
          <slot name="list-item" :item="item" />
        </q-item>
      </q-list>
    </template>

    <template slot="left-actions">
      <slot name="left-actions" />
    </template>

    <template slot="right">
      <slot name="item" :status="status" :readonly="readonly" />
    </template>
  </split-panel>
</template>

<script>
import CRUD from "./mixins/crud";
import SplitPanel from "./mixins/split-panel";
export default {
  name: "ListEditor",
  mixins: [CRUD, SplitPanel],
  props: {
    list: {
      type: Array,
      default: [],
    },
    itemKey: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      itemList: [],
      lastItem: null,
    };
  },
  watch: {
    list(val) {
      this.itemList = val;
      if (!this.entityVal && this.itemList && this.itemList.length > 0) {
        this.choose(this.list[0]);
      }
    },
  },
  mounted() {
    this.itemList = this.list;
    if (!this.$appHelper.isEmpty(this.entity)) {
      this.choose(this.entity);
    } else if (!this.entityVal && this.itemList && this.itemList.length > 0) {
      this.choose(this.list[0]);
    }
  },
  methods: {
    choose(item) {
      if (this.readonly) {
        this.status = "view";
        let ret = {};
        Object.assign(ret, item);
        this.lastItem = ret;
        this.entityVal = ret;
        this.$emit("change", this.entityVal);
      }
    },
    cancel() {
      if (this.lastItem) {
        this.status = "view";
        this.entityVal = this.lastItem;
        this.$emit("change", this.entityVal);
      } else if (this.list.length > 0) {
        this.status = "view";
        this.entityVal = this.list[0];
        this.$emit("change", this.entityVal);
      } else {
        this.status = "blank";
        this.entityVal = null;
        this.$emit("change", this.entityVal);
      }
      this.$parent.cancel && this.$parent.cancel();
      this.$emit("cancel");
    },
    saveItem() {
      let insert = this.$appHelper.isEmpty(this.entityVal.id);
      this.save((ret) => {
        if (insert) {
          this.itemList.push(ret);
        }
      });
    },
  },
};
</script>

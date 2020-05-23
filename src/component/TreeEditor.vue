<template>
  <split-panel v-bind="$props">
    <template slot="left-actions">
      <q-btn
        icon="refresh"
        flat
        color="primary"
        v-if="readonly"
        @click="refresh"
        dense
      />
    </template>
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
          @click="save"
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
      <div class="q-pa-sm">
        <q-tree :nodes="nodes" :node-key="nodeKey" default-expand-all v-if="nodes.length>0">
          <template v-slot:default-header="props">
            <div
              @click.stop="choose(props.node)"
              :class="{ 'cursor-pointer': readonly }"
            >
              <slot name="tree-node" :node="props.node" />
            </div>
          </template>
        </q-tree>
      </div>
    </template>

    <template slot="right">
      <slot name="node" :status="status" :readonly="readonly" />
    </template>

    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"
      ><slot :name="slot" v-bind="scope"
    /></template>
  </split-panel>
</template>

<script>
import CRUD from "./mixins/crud";
import SplitPanel from "./mixins/split-panel";
export default {
  name: "TreeEditor",
  mixins: [CRUD, SplitPanel],
  props: {
    nodes: {
      type: Array,
      default() {
        return [];
      },
    },
    nodeKey: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      nodeList: [],
      node: null,
      lastNode: null,
    };
  },
  watch: {
    nodes(val) {
      this.nodeList = val;
    },
  },
  mounted() {
    this.nodeList = this.nodes;
    this.node = this.entity;
  },
  methods: {
    refresh() {
      this.$parent.refresh && this.$parent.refresh();
      this.$emit("refresh");
    },
    choose(node) {
      if (this.readonly) {
        this.status = "view";
        let ret = {};
        Object.assign(ret, node);
        this.lastNode = ret;
        this.node = ret;
        this.$emit("change", this.node);
      }
    },
    cancel() {
      if (this.lastINode) {
        this.status = "view";
        this.node = this.lastNode;
        this.$emit("change", this.node);
      } else if (this.nodes.length > 0) {
        this.status = "view";
        this.node = this.nodes[0];
        this.$emit("change", this.node);
      } else {
        this.status = "blank";
        this.node = null;
        this.$emit("change", this.node);
      }
      this.$parent.cancel && this.$parent.cancel();
      this.$emit("cancel");
    },
  },
};
</script>

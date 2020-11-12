<template>
  <div class="tree">
    <q-tree
      :nodes="nodeTree"
      :node-key="nodeKey"
      default-expand-all
      v-if="nodeTree.length > 0"
    >
      <!--Tree Node-->
      <template v-slot:default-header="prop">
        <q-btn
          size="sm"
          dense
          class="full-width tree-node"
          align="left"
          flat
          no-caps
          :label="prop.node[labelKey]"
          :color="prop.node === selection ? 'primary' : ''"
          @click.stop="choose(prop.node)"
        >
          <q-popup-proxy context-menu>
            <q-list style="width: 100px;">
              <q-item clickable v-close-popup @click="view(prop.node)">
                <q-item-section>查看</q-item-section>
              </q-item>
              <q-item
                v-if="editable"
                clickable
                v-close-popup
                @click="create(prop.node)"
              >
                <q-item-section>添加</q-item-section>
              </q-item>
              <q-item
                v-if="editable"
                clickable
                v-close-popup
                @click="edit(prop.node)"
              >
                <q-item-section>编辑</q-item-section>
              </q-item>
              <q-item
                v-if="editable"
                clickable
                v-close-popup
                @click="remove(prop.node)"
              >
                <q-item-section>删除</q-item-section>
              </q-item>
            </q-list>
          </q-popup-proxy>
        </q-btn>
      </template>
    </q-tree>
    <popup-dialog v-model="dlg" :title="title">
      <q-form ref="form" @submit="save">
        <div class="q-pa-md">
          <q-select
            :readonly="readonly"
            v-if="entity"
            label="上级分类"
            v-model="entity.parentId"
            :options="nodeList"
            :option-label="labelKey"
            :option-value="nodeKey"
            clearable
            emit-value
            map-options
          />
          <slot
            v-if="entity"
            name="editor"
            :readonly="readonly"
            :form="entity"
            :nodes="nodeList"
          />
        </div>
        <div
          class="q-pa-sm text-center"
          style="border-top: 1px solid #ddd;"
          v-if="!readonly"
        >
          <q-btn
            type="submit"
            label="保存"
            color="primary"
            :loading="loading"
          />
        </div>
      </q-form>
    </popup-dialog>
  </div>
</template>

<script>
import base from "./mixins/base";
export default {
  name: "tree",
  mixins: [base],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {},
    title: {
      type: String,
      default: "节点信息",
    },
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
    labelKey: {
      type: String,
      default: "name",
    },
    editable: {
      type: Boolean,
      default: true,
    },
    service: {},
    listFn: Function,
    createFn: Function,
    saveFn: Function,
    removeFn: Function,
  },
  data() {
    return {
      selection: null,
      nodeList: [],
      nodeTree: [],
      dlg: false,
      entity: null,
      readonly: true,
      loading: false,
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    //取得节点Array
    getNodeList() {
      return this.nodeList;
    },
    //选择节点
    choose(node) {
      this.selection = node;
      this.$emit("change", this.selection);
    },
    //刷新
    refresh() {
      this.callFn("list", null, this.nodes).then((ret) => {
        this.nodeList = ret;
        this.nodeTree = this.$helper.buildTree(this.nodeList);
      });
    },
    //新建节点
    create(parent) {
      this.callFn("create", parent, {}).then((ret) => {
        this.entity = ret;
        if (parent) {
          this.entity.parentId = parent.id;
        }
        this.readonly = false;
        this.dlg = true;
      });
    },
    //查看
    view(node) {
      this.callFn("get", node[this.nodeKey], node).then((ret) => {
        this.entity = ret;
        this.readonly = true;
        this.dlg = true;
      });
    },
    //编辑节点
    edit(node) {
      this.callFn("get", node[this.nodeKey], Object.assign({}, node)).then(
        (ret) => {
          this.readonly = false;
          this.entity = ret;
          this.dlg = true;
        }
      );
    },
    //保存
    save() {
      this.$refs.form.validate().then((ret) => {
        ret && this.doSave();
      });
    },
    //保存处理
    doSave() {
      this.loading = true;
      this.callFn("save", this.entity)
        .then((ret) => {
          this.refresh();
          this.info("保存成功");
          this.dlg = false;
          this.readonly = true;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //删除节点
    remove(node) {
      this.callFn("remove", node[this.nodeKey]).then((ret) => {
        this.refresh();
        this.info("删除成功");
        this.readonly = true;
      });
    },
  },
};
</script>

<style>
.tree .tree-node {
  padding-left: 5px;
}
</style>

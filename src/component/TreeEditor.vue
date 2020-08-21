<template>
  <split-panel v-bind="$props" @init="init">
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
          :loading="loading"
          color="secondary"
          v-if="creatable && (status === 'view' || status === 'blank')"
          @click="create"
        />
        <q-btn
          label="保存"
          :loading="loading"
          color="primary"
          v-if="status === 'create' || status === 'edit'"
          @click="save"
        />
        <q-btn
          label="编辑"
          :loading="loading"
          color="primary"
          v-if="editable && status === 'view'"
          @click="edit"
        />
        <q-btn
          label="删除"
          :loading="loading"
          color="negative"
          v-if="removable && status === 'view'"
          @click="remove"
        />
        <q-btn
          label="取消"
          :loading="loading"
          color="secondary"
          v-if="status === 'edit' || status === 'create'"
          @click="cancel"
        />
      </div>
    </template>

    <template slot="left">
      <div class="q-pa-sm">
        <q-tree
          :nodes="nodeList"
          :node-key="nodeKey"
          default-expand-all
          v-if="nodeList.length > 0"
        >
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

    <template v-for="(key, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </split-panel>
</template>

<script>
import CRUD from "./mixins/crud";
import SplitPanel from "./mixins/split-panel";
export default {
  name: "TreeEditor",
  mixins: [CRUD, SplitPanel],
  props: {
    nodeKey: {
      type: String,
      default: "id",
    },
    refreshFn: {
      type: Function,
    },
  },
  data() {
    return {
      nodeList: [],
      lastNode: null,
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    //初始化
    init() {
      this.$emit("init");
    },
    //刷新
    refresh() {
      this.process("refresh", null, (ret) => {
        this.nodeList = ret;
        if (!this.entity && this.nodeList && this.nodeList.length > 0) {
          this.choose(this.nodeList[0]);
          this.lastNode = null;
          this.status = "view";
        }
      });
    },
    //新建
    create() {
      let parentId = this.entity.id;
      this.process("create", null, (ret) => {
        ret.parentId = parentId;
        this.updateValue(ret);
        this.status = "create";
      });
    },
    //编辑
    edit() {
      this.status = "edit";
      this.$emit("edit", this.entity);
    },
    //选择
    choose(node) {
      if (this.readonly) {
        this.status = "view";
        if (this.findFn("get")) {
          //定义了GET函数
          this.process("get", node.id, (ret) => {
            this.updateValue(ret);
            this.lastNode = ret;
          });
        } else {
          //没有定义GET函数
          let ret = {};
          Object.assign(ret, node);
          this.updateValue(ret);
          this.lastNode = ret;
        }
      }
    },
    //保存
    save() {
      let insert = this.isEmpty(this.entity.id);
      this.process("save", this.entity, () => {
        this.refresh();
        this.status = "view";
        this.$q.notify("保存成功");
      });
    },
    //删除确认
    remove() {
      this.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    //删除操作
    doRemove() {
      this.process("remove", this.entity.id, () => {
        this.refresh();
        this.info("删除成功");
      });
    },
    //取消
    cancel() {
      if (this.lastNode) {
        this.status = "view";
        this.updateValue(this.lastNode);
      } else if (this.nodeList && this.nodeList.length > 0) {
        this.status = "view";
        this.updateValue(this.nodeList[0]);
      } else {
        this.status = "blank";
        this.$emit = null;
        this.$emit("change");
      }
      this.$emit("cancel");
    },
    //获取当前树的节点列表
    getNodeList() {
      return this.$appHelper.treeToArray(this.nodeList);
    },
  },
};
</script>

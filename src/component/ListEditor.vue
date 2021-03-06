<template>
  <split-panel v-bind="$props">
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
      <slot name="left-actions">
        <q-btn flat dense icon="refresh" color="primary" @click="refresh" />
      </slot>
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
  mounted() {
    this.refresh();
  },
  methods: {
    //刷新
    refresh() {
      this.process("refresh", null, (ret) => {
        this.itemList = ret;
        if (!this.entity && this.itemList && this.itemList.length > 0) {
          this.choose(this.itemList[0]);
        }
      });
    },
    //新建
    create() {
      this.process("create", null, () => {
        this.status = "create";
      });
    },
    //编辑
    edit() {
      this.status = "edit";
    },
    //选择
    choose(item) {
      if (item && item.id) {
        let ret = this.process("get", item.id, (ret) => {
          if (!this.isEmpty(ret)) {
            this.status = "view";
            let entity = {};
            Object.assign(entity, item);
            this.lastItem = item;
            this.updateValue(entity);
          }
        });
        if (item && !ret) {
          //没有对应的处理方法
          this.status = "view";
          let entity = {};
          Object.assign(entity, item);
          this.lastItem = item;
          this.updateValue(entity);
        }
      }
    },
    //取消编辑
    cancel() {
      if (this.lastItem) {
        this.status = "view";
        this.entity = this.lastItem;
        this.$emit("change", this.entity);
      } else if (this.itemList.length > 0) {
        this.status = "view";
        this.entity = this.itemList[0];
        this.$emit("change", this.entity);
      } else {
        this.status = "blank";
        this.entity = null;
        this.$emit("change", this.entity);
      }
      this.$parent.cancel && this.$parent.cancel();
      this.$emit("cancel");
    },
    //保存项目
    save() {
      let insert = this.isEmpty(this.entity.id);
      this.process("save", this.entity, (ret) => {
        this.refresh();
        this.status = "view";
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
  },
};
</script>

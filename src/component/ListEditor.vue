<template>
  <split-panel v-bind="$props">
    <template slot="right-actions">
      <div class="q-gutter-sm">
        <q-btn
          label="新建"
          color="secondary"
          v-if="creatable && (status === 'view' || status === 'blank')"
          @click="process('create')"
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
          @click="process('edit')"
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
      if (!this.entity && this.itemList && this.itemList.length > 0) {
        this.choose(this.list[0]);
      }
    },
  },
  mounted() {
    this.itemList = this.list;
    if (!this.isEmpty(this.entity)) {
      this.choose(this.entity);
    } else if (!this.entity && this.itemList && this.itemList.length > 0) {
      this.choose(this.list[0]);
    }
  },
  methods: {
    //选择
    choose(item) {
      if (this.readonly && item && item.id) {
        //只有只读状态可以选择
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
      } else if (this.list.length > 0) {
        this.status = "view";
        this.entity = this.list[0];
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
    saveItem() {
      let insert = this.isEmpty(this.entity.id);
      this.process("save", this.entity, (ret) => {
        if (insert) {
          this.itemList.push(ret);
        }
      });
    },
    //删除确认
    remove() {
      this.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    //删除操作
    doRemove() {
      this.process("remove", this.entityVal.id),
        () => {
          if (this.lastItem) {
            this.choose(this.lastItem);
          } else {
            this.status = "blank";
            this.updateValue(null);
          }
        };
    },
  },
};
</script>

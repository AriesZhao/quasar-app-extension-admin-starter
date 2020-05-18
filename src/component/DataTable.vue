<template>
  <div class="datatable">
    <q-table
      :filter="filter"
      :loading="isLoading"
      separator="cell"
      :data="tableData"
      :columns="tableColumns"
      :pagination.sync="pagination"
      :rows-per-page-options="rowsPerPageOptions"
    >
      <!--top left-->
      <template v-slot:top-left>
        <div class="row q-col-gutter-sm">
          <div v-if="title" class="table-title">{{ title }}</div>
          <q-btn
            v-if="requestFn"
            icon="refresh"
            dense
            flat
            color="positive"
            @click="createItem"
          />
          <div v-if="editable">
            <q-btn
              v-if="editable && creatable"
              icon="add_circle"
              dense
              flat
              color="primary"
              @click="createItem"
            />
            <q-btn
              :disable="selectedItems.length !== 1"
              icon="edit"
              dense
              flat
              color="secondary"
              @click="editItem(selectedItems[0])"
            />
            <q-btn
              v-if="editable && removable"
              :disable="selectedItems.length < 1"
              icon="delete"
              dense
              flat
              color="negative"
              @click="removeItem"
            />
          </div>
        </div>
      </template>
      <!--top right-->
      <template v-slot:top-right>
        <div class="row q-gutter-sm">
          <q-input outlined dense v-model="filter" placeholder="查找">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <!--table header-->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="selection || editable" class="selection">
            <q-checkbox
              v-model="selectAll"
              v-if="tableData.length > 0"
              :disable="tableData.length < 1"
            />
          </q-th>
          <q-th
            :key="col.name"
            :props="props"
            v-for="(col, index) in tableColumns"
            :class="[
              stickyFirstColumn && index == 0 ? 'sticky-first' : '',
              stickyLastColumn && index == tableColumns.length - 1
                ? 'sticky-last'
                : '',
            ]"
          >
            <slot :name="`body-header-${col.name}`" :row="props.row">
              {{ col.label }}
            </slot>
          </q-th>
          <!--default action column header for editable table-->
          <q-th
            v-if="editable && !hasActionColumn && !hasActionSlot"
            class="action"
          >
            {{ actionTitle }}
          </q-th>
        </q-tr>
      </template>
      <!--table body-->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-if="selection || editable" class="selection">
            <q-checkbox v-model="selectedItems" :val="props.row[rowKey]" />
          </q-td>
          <q-td
            :key="col.name"
            :props="props"
            v-for="(col, index) in tableColumns"
            :class="[
              stickyFirstColumn && index == 0 ? 'sticky-first' : '',
              stickyLastColumn && index == tableColumns.length - 1
                ? 'sticky-last'
                : '',
            ]"
          >
            <slot :name="`body-cell-${col.name}`" :row="props.row">
              {{ props.row[col.name] }}
            </slot>
          </q-td>
          <!--default action column for editable table-->
          <q-td
            v-if="editable && !hasActionColumn && !hasActionSlot"
            class="action"
          >
            <q-btn
              icon="edit"
              dense
              flat
              color="secondary"
              @click="editItem(props.row[rowKey])"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!--editor dialog-->
    <popup-dialog
      title="详情"
      v-model="dialog"
      v-if="$slots['editor'] || $scopedSlots['editor']"
    >
      <slot name="editor" :item="item"> </slot>
      <template v-slot:footer>
        <q-btn label="取消" flat color="primary" @click="dialog = false" />
        <q-btn
          label="保存"
          color="primary"
          @click="saveItem"
          v-if="saveFn || $listeners.save"
        />
      </template>
    </popup-dialog>
  </div>
</template>

<script>
import datatable from "./mixins/datatable";
export default {
  mixins: [datatable],
  data() {
    return {
      dialog: false, //dialog model
      item: null, //selected item
      isLoading: false,
      filter: null,
      stickyFirstColumn: false,
      stickyLastColumn: false,
      tableData: [],
      tableColumns: [],
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 100,
      },
      selectedItems: [],
    };
  },
  computed: {
    // editable in editor
    editable() {
      return this.$slots.editor || this.$scopedSlots.editor;
    },
    removable() {
      return this.removeFn || this.$listeners.remove;
    },
    hasActionColumn() {
      return (
        this.columns &&
        this.columns.find((item) => {
          return item.name === this.actionColumn;
        })
      );
    },
    hasActionSlot() {
      return (
        this.$scopedSlots[`body-cell-${this.actionColumn}`] ||
        this.$slots[`body-cell-${this.actionColumn}`]
      );
    },
    selectAll: {
      set(val) {
        if (val) {
          //select all
          let items = [];
          this.tableData.forEach((item) => {
            items.push(item[this.rowKey]);
          });
          this.selectedItems = items;
        } else {
          //unselect all
          this.selectedItems = [];
        }
      },
      get() {
        if (this.selectedItems.length >= this.tableData.length) {
          return true;
        } else if (this.selectedItems.length < 1) {
          return false;
        } else {
          return null;
        }
      },
    },
  },
  mounted() {
    this.pagination.rowsPerPage = this.rowsPerPage;
    this.stickyFirstColumn = this.stickyFirst;
    this.stickyLastColumn = this.stickyLast;
    this.isLoading = this.loading;
    this.selectedItems = this.selected;
    if (this.data) {
      this.buildColumns(this.data);
      this.buildData(this.data);
    } else if (this.requestFn) {
      this.isLoading = true;
      this.requestFn()
        .then((ret) => {
          this.buildColumns(this.data);
          this.buildData(ret);
          this.isLoading = false;
        })
        .catch((err) => {
          this.$q.notify({ message: "加载数据错误", color: "negative" });
          console.info(err);
        });
    }
  },
  watch: {
    data(val) {
      this.buildColumns(val);
      this.buildData(val);
      this.selectedItems = [];
    },
    loading(val) {
      this.isLoading = val;
    },
    selectedItems(val) {
      this.selectedItems = val;
      this.$emit("change", this.selectedItems);
    },
  },
  methods: {
    // create new item
    async createItem() {
      if (this.createFn) {
        this.item = await this.createFn();
      } else if (this.$listeners.create) {
        this.$emit("create");
      } else {
        this.item = {};
      }
      this.dialog = true;
    },
    //save item
    saveItem() {
      if (this.saveFn) {
        const insert = this.$appHelper.isEmpty(this.item.id);
        this.saveFn(this.item)
          .then((ret) => {
            this.item = ret;
            this.$q.notify("保存成功");
            this.updateList(this.item, insert);
            this.dialog = false;
          })
          .catch((e) => {
            console.info(e);
            this.$q.notify({ message: "保存失败", color: "negative" });
          });
      } else {
        this.$emit("save", this.item);
      }
    },
    //edit item
    editItem(key) {
      let ret = {};
      this.item = Object.assign(
        ret,
        this.tableData.find((row) => {
          return row[this.rowKey] === key;
        })
      );
      if (this.viewFn) {
        this.item = this.viewFn(this.item);
      } else if (this.$listeners.view) {
        this.$emit("view", this.item);
      }
      this.dialog = true;
    },
    openItem(item) {
      let ret = {};
      this.item = Object.assign(ret, item);
      this.dialog = true;
    },
    //update table items
    updateList(item, insert) {
      if (insert) {
        this.tableData.push(item);
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i][this.rowKey] === item[this.rowKey]) {
            Object.assign(this.tableData[i], item);
          }
        }
      }
    },
    //remove item
    removeItem() {
      this.$q
        .dialog({
          title: "确认",
          message: "确定要删除当前所选记录吗？",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$emit("remove", this.selectedItems);
        });
    },
    //hide dialog
    hideDialog() {
      this.dialog = false;
    },
    buildData(data) {
      this.tableData = data;
    },
    buildColumns(data) {
      if (this.columns) {
        this.columns.forEach((item) => {
          if (!item.align) {
            item.align = this.align;
          }
          if (!item.field && item.name) {
            item.field = item.name;
          }
          if (!item.name && item.field) {
            item.name = item.field;
          }
        });
        this.tableColumns = this.columns;
      } else if (data.length > 0) {
        const columns = [];
        for (const key in data[0]) {
          if (
            !this.excludes ||
            !this.excludes.find((item) => {
              return item === key;
            })
          ) {
            columns.push({
              name: key,
              field: key,
              label: key,
              align: this.align,
              sortable: true,
            });
          }
        }
        this.tableColumns = columns;
      }
      if (!this.hasActionColumn && this.hasActionSlot) {
        this.tableColumns.push({
          name: this.actionColumn,
          label: this.actionTitle,
          align: this.align,
        });
        this.stickyLastColumn = true;
      }
    },
  },
};
</script>

<style lang="sass">
.datatable
  max-height: 100%

  max-width: 100%

  .table-title
      font-size: 16px
      line-height: 32px;

  tr th
    position: sticky
    z-index: 2
    background: #fafafa
    text-align: center

  thead tr:last-child th
    top: 48px
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    z-index: 3

  td:first-child
    z-index: 1

  .q-table__top
    min-height: 50px
    padding: 5px 15px

  .sticky-first
    background: #fafafa
    position: sticky
    left: 0

  .sticky-last
    background: #fafafa
    position: sticky
    right: 0
  .selection
    width: 40px
  .action
    text-align: center
</style>

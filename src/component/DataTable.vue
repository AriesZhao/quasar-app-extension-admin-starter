<template>
  <div class="datatable">
    <q-table
      :filter="filterText"
      :loading="isLoading"
      separator="cell"
      :data="tableData"
      :columns="tableColumns"
      :pagination.sync="pagination"
      :rows-per-page-options="rowsPerPageOptions"
      :dense="dense"
      :hide-header="hideHeader"
      @request="onRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <!--top left-->
      <template v-slot:top-left v-if="!hideTop">
        <div class="row">
          <div v-if="title" class="table-title">{{ title }}</div>
          <q-btn
            v-if="requestFn"
            icon="refresh"
            dense
            flat
            color="positive"
            @click="refresh"
          />
          <div v-if="editable">
            <q-btn
              v-if="creatable && hasEditorSlot"
              icon="add_circle"
              dense
              flat
              color="primary"
              @click="createItem"
            />
            <q-btn
              v-if="editable && hasEditorSlot"
              :disable="selectedItems.length !== 1"
              icon="edit"
              dense
              flat
              color="secondary"
              @click="editItem(selectedItems[0])"
            />
            <q-btn
              v-if="removable && hasEditorSlot"
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
      <template v-slot:top-right v-if="!hideTop">
        <slot name="top-right" />
        <div
          class="row q-gutter-sm"
          v-if="
            !requestFn && !($slots['top-right'] || $scopedSlots['top-right'])
          "
        >
          <q-input
            outlined
            dense
            clearable
            v-model="filterText"
            placeholder="查找"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <!--table header-->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="expandable" class="col-expand"> </q-th>
          <q-th v-if="selection || hasEditorSlot" class="col-selection">
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
            v-if="
              editable && hasEditorSlot && !hasActionColumn && !hasActionSlot
            "
            class="action"
          >
            {{ actionTitle }}
          </q-th>
        </q-tr>
      </template>
      <!--table body-->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width v-if="expandable" class="col-expand">
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              @click="expandItem(props.row)"
              :icon="props.row.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-if="selection || hasEditorSlot" class="col-selection">
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
              {{ props.row[col.field] }}
            </slot>
          </q-td>
          <!--default action column for editable table-->
          <q-td
            v-if="
              hasEditorSlot && editable && !hasActionColumn && !hasActionSlot
            "
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
        <q-tr v-show="props.row.expand" :props="props">
          <slot name="body-expand" :row="props.row" />
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
          v-if="editable && (service || saveFn || $listeners.save)"
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
    let pagination = {
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: 100,
    };
    if (this.requestFn) {
      pagination.rowsNumber = 0;
    }
    return {
      dialog: false, //dialog model
      item: null, //selected item
      isLoading: false,
      filterText: null,
      stickyFirstColumn: false,
      stickyLastColumn: false,
      tableData: [],
      tableColumns: [],
      pagination: pagination,
      selectedItems: [],
    };
  },
  computed: {
    hasEditorSlot() {
      return this.$scopedSlots.editor || this.$slots.editor;
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
      this.onRequest({ pagination: this.pagination });
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
    expandItem(row) {
      let item = this.tableData.find((item) => {
        return row[this.rowKey] === item[this.rowKey];
      });
      this.$set(item, "expand", !item.expand);
    },
    //refresh table
    refresh() {
      this.onRequest({ pagination: this.pagination });
    },
    // request data from server
    onRequest(props) {
      let pageable = {
        page: props.pagination.page - 1,
        size: props.pagination.rowsPerPage,
      };
      if (props.pagination.sortBy) {
        pageable.sort =
          props.pagination.sortBy +
          "," +
          (props.pagination.descending ? "DESC" : "ASC");
      }
      this.isLoading = true;
      this.requestFn(pageable)
        .then((ret) => {
          this.tableData = ret.content;
          this.buildColumns(this.tableData);
          this.buildData(this.tableData);
          this.pagination.sortBy = props.pagination.sortBy;
          this.pagination.descending = props.pagination.descending;
          this.pagination.page = props.pagination.page - 1;
          this.pagination.rowsPerPage = props.pagination.rowsPerPage;
          this.pagination.rowsNumber = ret.totalElements;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.$q.notify({ message: err, color: "negative" });
        });
    },
    // create new item
    async createItem() {
      if (this.createFn) {
        this.item = await this.createFn();
      } else if (this.$listeners.create) {
        this.$emit("create");
      } else if (this.service) {
        this.item = await this.service.create();
      } else {
        this.item = {};
      }
      this.dialog = true;
    },
    //save item
    saveItem() {
      let fn = this.saveFn;
      if (!fn && this.service && this.service.save) {
        fn = this.service.save;
      }
      if (fn) {
        this.loading = true;
        fn(this.item)
          .then((ret) => {
            this.loading = false;
            this.item = ret;
            if (this.showMessage) {
              this.$appHelper.info(this.message);
            }
            this.updateList(this.item);
            this.dialog = false;
          })
          .catch((err) => {
            this.loading = false;
            this.$appHelper.error(err);
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
    updateList(item) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][this.rowKey] === item[this.rowKey]) {
          Object.assign(this.tableData[i], item);
          return;
        }
      }
      this.tableData.push(item);
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
          if (this.removeFn) {
            this.removeFn(this.selectedItems)
              .then((ret) => {
                this.selectedItems.forEach((item) => {
                  this.tableData.splice(
                    this.tableData.find((row) => {
                      return row[this.rowKey] === item;
                    }),
                    1
                  );
                });
                this.$q.notify("删除成功");
              })
              .catch((err) => {
                this.$q.notify({ message: err, color: "negative" });
              });
          } else if (this.$listeners.remove) {
            this.$emit("remove", this.selectedItems);
          }
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
  .col-selection
    width: 40px
  .action
    text-align: center
  .q-table__bottom
    border-top: none
</style>

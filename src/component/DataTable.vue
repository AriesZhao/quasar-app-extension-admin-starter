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
        <div class="row">
          <div v-if="title" class="table-title">{{ title }}</div>
          <div v-if="editable">
            <q-btn icon="add" dense flat color="primary" @click="createItem" />
            <q-btn icon="remove" dense flat color="negative" />
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
          <q-th v-if="selection || editable">
            <q-checkbox v-model="selectAll" :disable="tableData.length < 1" />
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
        </q-tr>
      </template>
      <!--table body-->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-if="selection || editable">
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
        </q-tr>
      </template>
    </q-table>
    <!--editor dialog-->
    <popup-dialog
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
          v-if="$listeners.save"
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
    if (this.columns) {
      this.tableColumns = this.columns;
    }
    if (this.data) {
      this.buildData(this.data);
    } else if (this.request) {
      this.isLoading = true;
      this.request()
        .then((ret) => {
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
      this.buildData(val);
    },
    loading(val) {
      this.isLoading = val;
    },
    selectedItems(val) {
      this.$emit("change", this.selectedItems);
    },
  },
  methods: {
    // create new item
    createItem() {
      this.item = {};
      this.dialog = true;
    },
    //save item
    saveItem() {
      this.$emit("save", this.item);
    },
    //hide dialog
    hideDialog() {
      this.dialog = false;
    },
    buildData(data) {
      if (data.length > 0) {
        this.buildColumns(data[0]);
      }
      this.tableData = data;
    },
    buildColumns(row) {
      if (this.columns) {
        this.tableColumns = this.columns;
      } else {
        const columns = [];
        for (const key in row) {
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
              align: "center",
              sortable: true,
            });
          }
        }
        this.tableColumns = columns;
      }
      if (
        !this.tableColumns.find((item) => {
          return item.name === this.actionColumn;
        }) &&
        (this.$scopedSlots[`body-cell-${this.actionColumn}`] ||
          this.$slots[`body-cell-${this.actionColumn}`])
      ) {
        this.tableColumns.push({
          name: this.actionColumn,
          label: "操作",
          align: "center",
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
</style>

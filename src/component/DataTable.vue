<template>
  <q-table
    class="datatable"
    :filter="filter"
    :loading="isLoading"
    separator="cell"
    :data="tableData"
    :columns="tableColumns"
    :pagination.sync="pagination"
    :rows-per-page-options="rowsPerPageOptions"
  >
    <template v-slot:top-left>
      <span v-if="title" class="table-title">{{ title }}</span>
    </template>
    <template v-slot:top-right>
      <div class="row q-gutter-sm">
        <q-input outlined dense v-model="filter" placeholder="查找">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
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
            <q-icon
              v-if="pagination.sortBy !== col.name"
              name="fa fa-angle-down"
              class="cursor-pointer"
              @click="sort(col.field, true)"
            />
            <q-icon
              v-if="pagination.sortBy === col.name && pagination.descending"
              name="fa fa-angle-down"
              class="cursor-pointer"
              @click="sort(col.field, true)"
            /><q-icon
              v-if="pagination.sortBy === col.name && !pagination.descending"
              name="fa fa-angle-up"
              class="cursor-pointer"
              @click="sort(col.field, false)"
            />
            {{ col.label }}
          </slot>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
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
</template>

<script>
import datatable from "./mixins/datatable";
export default {
  mixins: [datatable],
  data() {
    return {
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
    };
  },
  mounted() {
    this.pagination.rowsPerPage = this.rowsPerPage;
    this.stickyFirstColumn = this.stickyFirst;
    this.stickyLastColumn = this.stickyLast;
    this.isLoading = this.loading;
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
  },
  methods: {
    sort(field, descending) {
      this.pagination.sortBy = field;
      this.pagination.descending = descending;
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
        this.$scopedSlots[`body-cell-${this.actionColumn}`] || [
          `body-cell-${this.actionColumn}`,
        ]
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

  tr th
    position: sticky
    z-index: 2
    background: #fafafa

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
    padding: 15px

  .sticky-first
    background: #fafafa
    position: sticky
    left: 0

  .sticky-last
    background: #fafafa
    position: sticky
    right: 0
</style>

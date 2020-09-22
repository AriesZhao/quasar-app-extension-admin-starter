<template>
  <q-card class="q-pa-sm uploader">
    <div class="row q-col-gutter-sm">
      <div class="col-6">
        <q-card>
          <q-toolbar
            class="bg-primary text-white rounded-borders"
            style="border-radius: 4px 4px 0px 0px"
          >
            <q-toolbar-title>{{ label }}</q-toolbar-title>
          </q-toolbar>
          <q-list bordered separator>
            <q-item clickable v-ripple>
              <q-item-section>附件列表为空</q-item-section>
            </q-item>
            <q-item v-for="item in files" :key="item.id" clickable v-ripple>
              <q-item-section>{{ item.filename }}</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col-6">
        <q-uploader
          ref="uploader"
          :url="`/api/oss/upload/${
            this.private ? 'private' : 'public'
          }/${type}/${id}`"
          label="上传文件"
          :multiple="multiple"
          field-name="file"
          style="width: 100%"
          :headers="[
            {
              name: 'Authorization',
              value: `Bearer ${token}`,
            },
          ]"
          @finish="finished"
        >
          <template v-slot:list="scope">
            <q-list separator>
              <q-item v-for="item in files" :key="item.id" clickable v-ripple>
                <q-item-label class="full-width ellipsis">
                  {{ item.filename }}
                </q-item-label>
                <q-item-section top side>
                  <q-btn
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                  />
                </q-item-section>
              </q-item>
              <q-item v-for="file in scope.files" :key="file.name">
                <q-item-section>
                  <q-item-label class="full-width ellipsis">
                    {{ file.name }}
                  </q-item-label>

                  <q-item-label caption>
                    {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                  </q-item-label>
                </q-item-section>

                <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                  <img :src="file.__img.src" />
                </q-item-section>

                <q-item-section top side>
                  <q-btn
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-uploader>
      </div>
    </div>
  </q-card>
</template>

<script>
import * as OSSService from "@api/OSSService";
export default {
  name: "Uploader",
  props: {
    //只读
    readonly: {
      type: Boolean,
      default: false,
    },
    //附件类型
    type: {
      String,
      required: true,
    },
    //附件关联ID
    id: {
      type: String,
      required: true,
    },
    //私有附件
    private: {
      type: Boolean,
      default: false,
    },
    // 显示文本
    label: {
      type: String,
      default: "附件列表",
    },
    // 上传多个文件
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    token() {
      return localStorage.getItem("token");
    },
  },
  data() {
    return {
      files: [],
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.files = await OSSService.getAttachment(this.type, this.id);
    },
    finished() {
      this.refresh();
      this.$refs.uploader.removeUploadedFiles();
    },
  },
};
</script>

<style>
.uploader .q-uploader__header {
  height: 50px;
}
.uploader .q-toolbar__title {
  font-size: 18px;
}
.uploader .q-uploader__title {
  font-weight: normal;
}
.uploader .q-uploader__list {
  min-height: 50px;
}
</style>

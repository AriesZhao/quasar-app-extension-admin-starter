<template>
  <q-uploader
    color="white"
    bordered
    flat
    text-color="black"
    class="uploader"
    ref="uploader"
    :url="`/api/oss/upload/${
      this.private ? 'private' : 'public'
    }/${type}/${id}`"
    :label="label"
    :multiple="multiple"
    :readonly="readonly"
    field-name="file"
    style="width: 100%"
    :headers="[
      {
        name: 'Authorization',
        value: `Bearer ${token}`,
      },
    ]"
    :filter="filterFn"
    @finish="finished"
  >
    <template v-slot:list="scope">
      <q-list separator>
        <q-item v-for="item in files" :key="item.id" clickable>
          <q-item-section>
            <q-item-label>
              {{ item.filename
              }}<span class="file-size">{{ fileSize(item.size) }}</span>
            </q-item-label>
            <q-item-label caption>
              {{ item.uploadTime }}<span class="split" />{{
                item.uploadUserName
              }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="q-gutter-md">
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                color="positive"
                icon="iconfont icon-download"
                @click="download(item)"
              />
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                color="negative"
                icon="delete"
                @click="remove(item)"
              />
            </div>
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
    //刷新文件列表
    async refresh() {
      this.files = await OSSService.getAttachment(this.type, this.id);
    },
    //过滤重复文件
    filterFn(files) {
      return files.filter((file) => {
        let existing = this.files.find((item) => {
          return item.filename === file.name;
        });
        if (existing) {
          this.$q.notify(`${file.name}已经存在`);
        }
        return !existing;
      });
    },
    //上传结束
    finished() {
      this.refresh();
      this.$refs.uploader.reset();
      this.$q.notify("上传完成");
    },
    //计算文件大小
    fileSize(size) {
      if (size < 1000) {
        return size + "字节";
      } else if (size < 1000000) {
        return (size / 1024).toFixed(0) + "K";
      } else if (size < 10000000000) {
        return (size / 1048576).toFixed(2) + "M";
      } else {
        return (size / 1073741824).toFixed(2) + "G";
      }
    },
    //下载附件
    download(file) {
      window.open(file.url + "/" + file.objectKey);
    },
    //删除附件
    remove(file) {
      OSSService.remove(file.id).then((ret) => {
        this.$q.notify(`删除${file.filename}成功`);
        this.refresh();
      });
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
.uploader .file-size {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
  margin-left: 15px;
}
.uploader .split {
  margin: 0 10px;
}
</style>

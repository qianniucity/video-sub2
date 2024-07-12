# 有更快的方式上传 video，或者更快的方式读取 video 文件的方法吗
在前端直接处理视频文件时，使用 FileReader 读取文件内容是一种常见方法，尤其是当需要将视频文件转换为DataURL以在客户端预览时。然而，这种方法可能不是最高效的，特别是对于大型视频文件，因为它需要读取整个文件内容并将其转换为一个很大的字符串。

如果目标是上传视频文件，而不是在客户端预览，可以考虑以下几种更高效的方法：

直接上传而不预览:

直接将 File 对象发送到服务器，而不是先读取文件内容。这可以通过HTML表单或使用 FormData 与 fetch API结合来实现。
分块上传:

对于非常大的文件，可以将文件分割成小块，然后逐块上传。这样即使遇到网络问题，也只需重新上传失败的那一小部分，而不是整个文件。
使用服务端加速:

一些云存储服务（如AWS S3、Google Cloud Storage）提供了直接从客户端到存储服务的上传功能，这些服务通常会优化上传路径，提供更快的上传速度。
Web Workers:

对于需要在客户端处理文件（如读取文件内容）的情况，可以考虑使用Web Workers来避免阻塞主线程，尽管这不会加快读取速度，但可以改善用户体验。
流式上传:

如果服务器支持，可以考虑使用HTTP/2或类似技术实现流式上传，这样可以在读取文件的同时上传，减少等待时间。
下面是一个简单的示例，展示如何使用 FormData 和 fetch API直接上传文件，而不是先读取文件内容：
```javascript
const uploadVideoDirectly = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
        const response = await fetch('YOUR_SERVER_ENDPOINT', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log('Upload successful', result);
    } catch (error) {
        console.error('Upload failed', error);
    }
};
```

这种方法直接上传文件，避免了读取和转换文件内容的开销，适用于上传操作。对于需要在客户端预览视频的场景，如果视频文件很大，可能需要考虑其他策略，如生成并上传一个较小的预览版本。

# 初始化视频的时候，如果有字幕文件，则显示字幕列表 (完成)


# 字幕历史数据回滚功能

# 清空字幕(完成)

# 保存字幕 VTT SRT ASS

# 字幕翻译

```javascript
// 时间轴整体偏移开关
    overallOffsetSwitch() {
        this.setState({
            overallOffset: !this.state.overallOffset,
        });
    }
```


```javascript
// 设置语言
    setLocale(lang) {
        this.setState(
            {
                lang,
            },
            () => {
                setLocale(lang);
                this.storage.set('lang', lang);
            },
        );
    }

```

```javascript
// 整体字幕翻译
    translate(land, translator) {
        if (!this.inTranslation) {
            if (this.state.subtitles.length <= 1000) {
                this.inTranslation = true;
                translate(this.state.subtitles, land, translator)
                    .then(subtitles => {
                        this.inTranslation = false;
                        this.updateSubtitles(subtitles, true).then(() => {
                            toastr.success(t('translate'));
                        });
                    })
                    .catch(error => {
                        toastr.error(error.message);
                        this.inTranslation = false;
                        throw error;
                    });
            } else {
                toastr.error(t('translateLenght'));
            }
        } else {
            toastr.error(t('translateProgress'));
        }
    }

```

```javascript
// 整体字幕时间偏移
    timeOffset(time) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            item.start = secondToTime(clamp(item.startTime + time, 0, Infinity));
            item.end = secondToTime(clamp(item.endTime + time, 0, Infinity));
            return item;
        });
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(`${t('offset')}: ${time}s`);
        });
    }

```

```javascript
  // 下载字幕
    downloadSubtitles() {
        downloadFile(vttToUrl(arrToVtt(this.state.subtitles)), `${Date.now()}.vtt`);
        toastr.success(t('download'));
    }

    // 删除空字幕
    removeEmptySubtitle() {
        const subtitles = this.state.subtitles.filter(item => item.text.trim());
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('removeEmpty'));
        });
    }

    // 删除所有字幕
    removeAllSubtitle() {
        this.updateSubtitles([], true).then(() => {
            toastr.success(t('removeAll'));
        });
    }

```

```javascript
// 合并当前与下一个字幕
    mergeSubtitle(sub) {
        if (!this.checkSub(sub)) return;
        const subtitles = this.state.subtitles;
        const index = subtitles.indexOf(sub);
        const current = subtitles[index];
        const next = subtitles[index + 1];
        if (!next) return;
        const merge = new Sub(current.start, next.end, current.text + '\n' + next.text);
        merge.highlight = true;
        subtitles[index] = merge;
        subtitles.splice(index + 1, 1);
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('merge'));
            this.updateCurrentIndex(sub);
        });
    }

```

```javascript
// 插入单个新字幕
    insertSubtitle(index) {
        const subtitles = this.state.subtitles.map(item => {
            item.highlight = false;
            item.editing = false;
            return item;
        });
        const previous = subtitles[index - 1];
        const start = previous ? secondToTime(previous.endTime + 0.001) : '00:00:00.001';
        const end = previous ? secondToTime(previous.endTime + 1.001) : '00:00:01.001';
        const text = t('your');
        const sub = new Sub(start, end, text);
        sub.highlight = true;
        subtitles.splice(index, 0, sub);
        this.updateSubtitles(subtitles, true).then(() => {
            toastr.success(t('add'));
            this.updateCurrentIndex(sub);
        });
    }

```

```javascript

```

```javascript

```


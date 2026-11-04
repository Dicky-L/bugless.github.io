# MYDESK 外包雷达归档数据协议 (V0.4)

这里仅保存可公开的、经过筛选的远程项目报告摘要。**不包含用户姓名、联系方式、真实持仓或私有聊天记录。**

## 文件与去重

每日午间写入 `YYYY-MM-DD-noon.json`，晚间写入 `YYYY-MM-DD-evening.json`；文件位置：`mydesk-data/gigs/`。每次任务只新建当天对应文件，若已存在则先读取现有 blob SHA 再更新。不同批次不得覆盖彼此，不改写旧日期原始判断。插件按 `id` 去重，修改已存在的 ID 只更新原文而不重复弹窗。

字段：`schema_version:1`, `id:gig-YYYY-MM-DD-noon|evening`, `category:gig`, `date:YYYY-MM-DD`, `slot:noon|evening`, `title`, `summary` (<=360字符), `body` (Markdown), `source`, `importance:normal|high|critical`, `verified:boolean`, `recommended_count:integer`。

- `recommended_count` 仅统计**已核验、确实推荐联系的本期新增项目**；不算 NO-GO / 旧线索。可以是 0。
- `verified` 表示这是实际任务报告记录，推荐时源帖内容已经核验；不代表当前仍在招聘。
- 只有推荐数 > 0、核验为 true 并且确有临近时效/明确可行动优质机会时，才将 `importance` 设置为 `high`；普通日报一律 `normal`。
- `body` 附上带原帖链接的具体内容、核验事实和未核实信息。没有有效项目时按实际写 0，**绝不为了通知虚构项目**。

Chrome 扩展每 15 分钟读取 GitHub Contents API，首次读取作为历史基线且不弹通知。GitHub Pages 的部署状态不影响从仓库原始文件的读取。

Cron Tasks
==========

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/zokugun.cron-tasks?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=zokugun.cron-tasks)
[![Open VSX Version](https://img.shields.io/open-vsx/v/zokugun/cron-tasks?label=Open%20VSX)](https://open-vsx.org/extension/zokugun/cron-tasks)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

With [Cron Tasks](https://github.com/zokugun/vscode-cron), you can schedule tasks/jobs to run periodically at fixed times, dates, or intervals.

HowTo
-----

```jsonc
"cronTasks.tasks": [
    {
        "at": "* * * * *",
        "run": "cronTasks.showTestMessage",
    },
],
```

- `at`: a [cron expression](https://en.wikipedia.org/wiki/Cron)
- `run`: a vscode command

Debugging
---------

The extension always prints out debug information into the channel `Cron Tasks` of the panel `Output` (menu: `View` / `Output`).

But if the property `cronTasks.debug` (`false` by default) is `true` or `"on"`, the extension will bring that channel to focus.

### blank

With `"cronTasks.debug": "useBlank"`, the extension will print out debug information as usual but it won't call the final task.

### test command

The command `cronTasks.showTestMessage` will display a simple notification.

Notification
------------

The property `cronTasks.notification` (`minor` by default) indicates when to show the update notification.

Donations
---------

Support this project by becoming a financial contributor.

<table>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
        <td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
        <td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
        <td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
    </tr>
</table>

**Enjoy!**

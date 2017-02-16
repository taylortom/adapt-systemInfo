# adapt-systemInfo

This is an Adapt **authoring tool plugin** which displays system information about the current instance, and adds the ability to update the installed framework version via the user interface.

## Installation

1. Copy all sub-folders in `/routes/` to `/routes/` in your authoring tool folder.
2. Copy all sub-folders in `/frontend/` to `/frontend/src/plugins/` in your authoring tool folder.

## Usage

_**Note**: this feature is only available to users with a **Super Admin** account_.

The system information page can be accessed via the item in the global menu.

To update the framework, use the ‘check for updates’ button.

### Framework update notes

The update is a one-way process. **Perform a full backup of the system** before attempting this.

For the framework update to take effect in any individual courses, a preview is required (the update process will ensure that each course is fully rebuilt the next time a preview is attempted).
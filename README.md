# Scale Fit Fill for Adobe Illustrator

A compact panel with two buttons to resize selected artwork proportionally and center it on the active artboard.

- **Fit:** keeps the whole selection within the artboard.
- **Fill:** covers the artboard; artwork can extend beyond its edges. It does not create a clipping mask.

## Use

Select the active artboard, select artwork, open **Scale Fit Fill**, and click **Fit** or **Fill**. The selection is treated as one combined bounding box. Locked and hidden items are skipped. Undo in Illustrator to reverse a resize.

Requires Illustrator with CEP 11 support. Manual Windows installation may work with CEP support, but this release provides a macOS installer and has no verified Windows compatibility.

## Install on macOS

1. Download the ZIP from **Releases** and extract it.
2. Quit the Adobe application.
3. Open Terminal in the extracted folder and run `bash install-mac.sh`.
4. The installer asks before enabling Adobe's unsigned CEP extension mode. This setting allows unsigned CEP panels in other Adobe applications too. Without it, these unsigned panels may not appear.
5. Restart the application and open the panel from **Window → Extensions** (or **Extensions (Legacy)**).

The installer makes a dated backup if the panel is already installed. It does not install external dependencies or require administrator access.

## Uninstall

Quit the Adobe application and remove the installed panel folder from `~/Library/Application Support/Adobe/CEP/extensions/`. If you no longer need any unsigned panels, reset the setting for each enabled CEP version with `defaults delete com.adobe.CSXS.11 PlayerDebugMode` (repeat for 9, 10, 12 and 13 as applicable). Resetting it affects other unsigned panels too.

## Support and compatibility

This is a community CEP extension, not an Adobe Marketplace signed package. Adobe version ranges in the manifest are not a compatibility test matrix. Release checks validate JavaScript syntax and packaging; operation inside each Adobe version needs user testing. Report your macOS version, Adobe version, steps, and error message in **Issues**. Remove private file paths or media links from logs before posting.

## License

MIT — free to use, modify and redistribute. See [LICENSE](LICENSE). Adobe product names belong to their respective owners; this project is independent of Adobe.

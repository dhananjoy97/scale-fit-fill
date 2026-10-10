function scaleFitFill(mode) {
  if (app.documents.length === 0) {
    return "Open a document first.";
  }

  var doc = app.activeDocument;
  if (!doc.selection || doc.selection.length === 0) {
    return "Select artwork or a layer first.";
  }

  var artboardIndex = doc.artboards.getActiveArtboardIndex();
  var artboardRect = doc.artboards[artboardIndex].artboardRect;
  var target = {
    left: artboardRect[0],
    top: artboardRect[1],
    right: artboardRect[2],
    bottom: artboardRect[3]
  };
  var targetWidth = target.right - target.left;
  var targetHeight = target.top - target.bottom;

  var items = selectedPageItems(doc.selection);
  if (items.length === 0) {
    return "Select artwork or a layer first.";
  }

  var bounds = selectionBounds(items);
  var sourceWidth = bounds.right - bounds.left;
  var sourceHeight = bounds.top - bounds.bottom;

  if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) {
    return "Could not read the selected artwork or artboard size.";
  }

  var scale = mode === "fill"
    ? Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight)
    : Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);

  var sourceCenterX = bounds.left + sourceWidth / 2;
  var sourceCenterY = bounds.bottom + sourceHeight / 2;
  var targetCenter = centerOf(target);
  var sourceCenter = centerOf(bounds);

  var matrix = new Matrix();
  matrix.mValueA = scale;
  matrix.mValueB = 0;
  matrix.mValueC = 0;
  matrix.mValueD = scale;
  matrix.mValueTX = sourceCenter.x - (sourceCenter.x * scale);
  matrix.mValueTY = sourceCenter.y - (sourceCenter.y * scale);

  for (var i = 0; i < items.length; i++) {
    items[i].transform(matrix, true, true, true, true, scale * 100);
  }

  normalizeSize(mode, items, targetWidth, targetHeight);
  centerItemsOnArtboard(items, targetCenter);

  app.redraw();
  return "ok";
}

function selectedPageItems(selection) {
  var items = [];

  for (var i = 0; i < selection.length; i++) {
    collectPageItems(selection[i], items);
  }

  return items;
}

function collectPageItems(item, items) {
  if (!item || item.locked || item.hidden) {
    return;
  }

  if (item.typename === "Layer") {
    for (var i = 0; i < item.pageItems.length; i++) {
      collectPageItems(item.pageItems[i], items);
    }
    return;
  }

  if (item.typename === "GroupItem" && item.clipped) {
    items.push(item);
    return;
  }

  if (item.typename === "GroupItem") {
    items.push(item);
    return;
  }

  if (item.visibleBounds) {
    items.push(item);
  }
}

function selectionBounds(items) {
  var first = items[0].visibleBounds;
  var bounds = {
    left: first[0],
    top: first[1],
    right: first[2],
    bottom: first[3]
  };

  for (var i = 1; i < items.length; i++) {
    var itemBounds = items[i].visibleBounds;
    bounds.left = Math.min(bounds.left, itemBounds[0]);
    bounds.top = Math.max(bounds.top, itemBounds[1]);
    bounds.right = Math.max(bounds.right, itemBounds[2]);
    bounds.bottom = Math.min(bounds.bottom, itemBounds[3]);
  }

  return bounds;
}

function normalizeSize(mode, items, targetWidth, targetHeight) {
  var bounds = selectionBounds(items);
  var width = bounds.right - bounds.left;
  var height = bounds.top - bounds.bottom;

  if (width <= 0 || height <= 0) {
    return;
  }

  var correction = mode === "fill"
    ? Math.max(targetWidth / width, targetHeight / height)
    : Math.min(targetWidth / width, targetHeight / height);

  if (Math.abs(correction - 1) < 0.001) {
    return;
  }

  var center = centerOf(bounds);
  var matrix = new Matrix();
  matrix.mValueA = correction;
  matrix.mValueB = 0;
  matrix.mValueC = 0;
  matrix.mValueD = correction;
  matrix.mValueTX = center.x - (center.x * correction);
  matrix.mValueTY = center.y - (center.y * correction);

  for (var i = 0; i < items.length; i++) {
    items[i].transform(matrix, true, true, true, true, correction * 100);
  }
}

function centerItemsOnArtboard(items, targetCenter) {
  var bounds = selectionBounds(items);
  var sourceCenter = centerOf(bounds);
  var dx = targetCenter.x - sourceCenter.x;
  var dy = targetCenter.y - sourceCenter.y;

  for (var i = 0; i < items.length; i++) {
    items[i].translate(dx, dy);
  }
}

function centerOf(bounds) {
  return {
    x: bounds.left + (bounds.right - bounds.left) / 2,
    y: bounds.bottom + (bounds.top - bounds.bottom) / 2
  };
}

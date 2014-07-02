"use strict";

module.exports = {
  "version": 3,
  "sprite": "http://mapbox-kkaefer.s3.amazonaws.com/static/outdoors-gl/sprite",
  "glyphs": "http://mapbox.s3.amazonaws.com/gl-glyphs-256/{{fontstack}}/{{range}}.pbf",
  "constants": {
    "@land": "#eee",
    "@water": "#999",
    "@park": "#bda",
    "@road": "#FF00FF",
    "@border": "#6d90ab",
    "@building": "#ddd",
    "@building_outline": "#ccc",
    "@text": "#000000",
    "@road_blur": 1,
    "@stroke_width": 0.25
  },
  "sources": {
    "mapbox.mapbox-streets-v5": {
      "type": "vector",
      "url": "mapbox://mapbox.mapbox-streets-v5",
      "maxZoom": 14
    }
  },
  "layers": [{
    "id": "background",
    "style": {
      "fill-color": "@land",
      "transition-fill-color": {
        "duration": 500,
        "delay": 0
      }
    }
  }, {
    "id": "park",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "landuse",
    "filter": { "class": "park" },
    "render": {
      "type": "fill"
    },
    "style": {
      "fill-color": "@park"
    }
  }, {
    "id": "water",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "water",
    "render": {
      "type": "fill"
    },
    "style": {
      "fill-color": "blue"
    }
  }, {
    "id": "road",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "road",
    "render": {
      "type": "line",
      "line-cap": "round",
      "line-join": "bevel"
    },
    "style": {
      "line-color": "@road",
      "line-blur": "@road_blur",
      "line-width": {
        "fn": "exponential",
        "z": 10,
        "val": -1,
        "slope": 0.2,
        "min": 1,
        "max": 1000
      }
    }
  }, {
    "id": "building",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "building",
    "render": {
      "type": "fill"
    },
    "style": {
      "fill-color": "@building",
      "transition-fill-opacity": {
        "duration": 500,
        "delay": 500
      },
      "fill-opacity": {
        "fn": "linear",
        "z": 14,
        "val": 0,
        "slope": 1,
        "min": 0,
        "max": 1
      }
    },
    "style.night": {
      "fill-color": "blue"
    }
  }, {
    "id": "borders",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "admin",
    "render": {
      "type": "line"
    },
    "style": {
      "line-color": "rgba(0, 0, 0, 0.3)",
      "line-width": 1
    }
  }, {
    "id": "poi",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "poi_label",
    "render": {
      "type": "icon",
      "icon-size": 12
    },
    "style": {
      "icon-rotate-anchor": "viewport"
    }
  }, {
    "id": "country_label",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "country_label",
    "filter": { "$type": "point" },
    "render": {
      "type": "text",
      "text-field": "{{name}}",
      "text-font": "Open Sans Regular, Arial Unicode MS Regular",
      "text-max-size": 16,
      "text-path": "horizontal",
      "text-padding": 10
    },
    "style": {
      "text-halo-color": "rgba(255, 255, 255, 0.7)",
      "text-halo-width": "@stroke_width",
      "text-color": "@text"
    }
  }, {
    "id": "road_label",
    "source": "mapbox.mapbox-streets-v5",
    "source-layer": "road_label",
    "filter": { "$type": "line" },
    "render": {
      "type": "text",
      "text-field": "{{name}}",
      "text-font": "Open Sans Regular, Arial Unicode MS Regular",
      "text-max-size": 12,
      "text-path": "curve",
      "text-min-distance": 250,
      "text-max-angle": 1.04
    },
    "style": {
      "text-color": "@text",
      "text-halo-color": "rgba(255, 255, 255, 0.7)",
      "text-halo-width": "@stroke_width",
      "text-size": {
        "fn": "exponential",
        "z": 14,
        "val": 8,
        "slope": 1,
        "min": 8,
        "max": 12
      }
    }
  }]
};

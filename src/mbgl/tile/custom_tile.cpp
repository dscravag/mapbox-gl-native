#include <mbgl/tile/custom_tile.hpp>
#include <mbgl/tile/geojson_tile_data.hpp>
#include <mbgl/renderer/query.hpp>
#include <mbgl/renderer/tile_parameters.hpp>
#include <mbgl/actor/scheduler.hpp>

#include <mapbox/geojsonvt.hpp>

namespace mbgl {

CustomTile::CustomTile(const OverscaledTileID& overscaledTileID,
                         std::string sourceID_,
                         const TileParameters& parameters,
                         const style::CustomVectorSource::TileOptions options_,
                         ActorRef<style::CustomTileLoader> loader_)
    : GeometryTile(overscaledTileID, sourceID_, parameters),
    necessity(Resource::Optional),
    options(options_),
    loader(loader_),
    actor(*Scheduler::GetCurrent(), std::bind(&CustomTile::setTileData, this, std::placeholders::_1)) {
}

CustomTile::~CustomTile() {
    loader.invoke(&style::CustomTileLoader::removeTile, id);
}

void CustomTile::setTileData(const GeoJSON& geoJSON) {

    auto featureData = mapbox::geometry::feature_collection<int16_t>();
    if (geoJSON.is<FeatureCollection>() && !geoJSON.get<FeatureCollection>().empty()) {
        const double scale = util::EXTENT / options.tileSize;

        mapbox::geojsonvt::TileOptions vtOptions;
        vtOptions.extent = util::EXTENT;
        vtOptions.buffer = std::round(scale * options.buffer);
        vtOptions.tolerance = scale * options.tolerance;
        featureData = mapbox::geojsonvt::geoJSONToTile(geoJSON, id.canonical.z, id.canonical.x, id.canonical.y, vtOptions).features;
    }
    setData(std::make_unique<GeoJSONTileData>(std::move(featureData)));
}

void CustomTile::setNecessity(Necessity newNecessity) {
   if (newNecessity != necessity) {
        necessity = newNecessity;
        if (necessity == Necessity::Required) {
            loader.invoke(&style::CustomTileLoader::fetchTile, id, actor.self());
        } else if(!isRenderable()) {
            loader.invoke(&style::CustomTileLoader::cancelTile, id);
        }
    }
}

void CustomTile::querySourceFeatures(
    std::vector<Feature>& result,
    const SourceQueryOptions& queryOptions) {

    // Ignore the sourceLayer, there is only one
    auto layer = getData()->getLayer({});

    if (layer) {
        auto featureCount = layer->featureCount();
        for (std::size_t i = 0; i < featureCount; i++) {
            auto feature = layer->getFeature(i);
            
            // Apply filter, if any
            if (queryOptions.filter && !(*queryOptions.filter)(*feature)) {
                continue;
            }

            result.push_back(convertFeature(*feature, id.canonical));
        }
    }
}

} // namespace mbgl

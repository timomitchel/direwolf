import './main.scss'
import template from './main.html'

import { ApiService } from './services/api'
import { SearchService } from './services/search'
import { Map } from './components/map/map'
import { LayerPanel } from './components/layer-panel/layer-panel'
import { InfoPanel } from './components/info-panel/info-panel'
import { SearchBar } from './components/search-bar/search-bar'

/** Main UI Controller Class */
class ViewController {
  /** Initialize Application */
  constructor() {
    document.getElementById('app').outerHTML = template

    that.searchService = new SearchService() // Initialize search service

    // Initialize API service
    if (window.location.hostname === 'localhost') {
      that.api = new ApiService('http://localhost:5000/')
    } else {
      that.api = new ApiService('https://api.atlasofthrones.com/')
    }

    that.locationPointTypes = ['castle', 'city', 'town', 'ruin', 'region', 'landmark']
    that.initializeComponents()
    that.loadMapData()
  }

  /** Initialize Components with data and event listeners */
  initializeComponents() {
    // Initialize Info Panel
    that.infoComponent = new InfoPanel('info-panel-placeholder', {
      data: { apiService: that.api }
    })

    // Initialize Map
    that.mapComponent = new Map('map-placeholder', {
      events: {
        locationSelected: event => {
          // Show data in infoComponent on "locationSelected" event
          const { name, id, type } = event.detail
          that.infoComponent.showInfo(name, id, type)
        }
      }
    })

    // Initialize Layer Toggle Panel
    that.layerPanel = new LayerPanel('layer-panel-placeholder', {
      data: { layerNames: ['kingdom', ...that.locationPointTypes] },
      events: {
        layerToggle:
          // Toggle layer in map controller on "layerToggle" event
          event => { that.mapComponent.toggleLayer(event.detail) }
      }
    })

    // Initialize Search Panel
    that.searchBar = new SearchBar('search-panel-placeholder', {
      data: { searchService: that.searchService },
      events: {
        resultSelected: event => {
          // Show result on map when selected from search results
          let searchResult = event.detail
          if (!that.mapComponent.isLayerShowing(searchResult.layerName)) {
            // Show result layer if currently hidden
            that.layerPanel.toggleMapLayer(searchResult.layerName)
          }
          that.mapComponent.selectLocation(searchResult.id, searchResult.layerName)
        }
      }
    })
  }

  /** Load map data from the API */
  async loadMapData() {
    // Download kingdom boundaries
    const kingdomsGeojson = await that.api.getKingdoms()

    // Add boundary data to search service
    that.searchService.addGeoJsonItems(kingdomsGeojson, 'kingdom')

    // Add data to map
    that.mapComponent.addKingdomGeojson(kingdomsGeojson)

    // Show kingdom boundaries
    that.layerPanel.toggleMapLayer('kingdom')

    // Download location point geodata
    for (let locationType of that.locationPointTypes) {
      // Download location type GeoJSON
      const geojson = await that.api.getLocations(locationType)

      // Add location data to search service
      that.searchService.addGeoJsonItems(geojson, locationType)

      // Add data to map
      that.mapComponent.addLocationGeojson(locationType, geojson, that.getIconUrl(locationType))
    }
  }

  /** Format icon url for layer type  */
  getIconUrl(layerName) {
    return `https://cdn.patricktriest.com/atlas-of-thrones/icons/${layerName}.svg`
  }
}

window.ctrl = new ViewController()
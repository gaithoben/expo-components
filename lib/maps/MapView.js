import React, { useState, useEffect, useRef } from 'react';
import RNMapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import moment from 'moment';

import Block from '../Block';
import useDebounce from '../useDebounce';
import composeRefs from '../utils/composeRefs';
import mapUtils from '../utils/mapUtils';

const defaultRegion = {
  latitude: -1.0242858,
  longitude: 37.067136,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

// 36.8854637, -1.2188715

const MapView = React.forwardRef(
  (
    {
      children,
      onRegionChange,
      onLocationChange,
      onUserLocationChange,
      onMapReady,
      minZoom,
      onPress,
      simplemap,
      style,
      region,
      ...props
    },
    externalRef
  ) => {
    const mapRef = useRef(null);
    const [location, setLocation] = useState(region);
    const [currentregion, setCurrentRegion] = useState({
      ...defaultRegion,
      ...region
    });
    const [initialuserlocationset, setUserLocationHasBeenSet] = useState(false);
    const [locationupdated, setLocationUpdated] = useState(false);
    const [mapready, setMapReady] = useState(false);
    const [minutetimer, setMinuteTimer] = useState(new Date().getTime());

    const debouncedRegion = useDebounce(currentregion, 300);

    useEffect(() => {
      if (mapready) {
        //  onRegionChange({ ...currentregion, ...debouncedRegion });
      }

      if (debouncedRegion.latitude && location.latitude) {
        // Check if mapregion has changed by more than one km
        const dist = mapUtils.distanceInKmBetweenEarthCoordinates(
          location,
          debouncedRegion
        );
        if (dist > 0.5) {
          setLocation(debouncedRegion);
          onLocationChange(debouncedRegion);
        }
      }
    }, [debouncedRegion, mapready]);

    const regionChanged = region => {
      if (mapready) {
        setCurrentRegion({ ...currentregion, ...region });
      }
      if (!location.latitude) {
        setLocation(region);
      }
    };

    const regionChangeComplete = region => {
      onRegionChange({ ...currentregion, ...region });
    };

    useEffect(() => {
      const userLocation = { ...defaultRegion, ...region };
      if (mapRef.current && mapready && region.latitude && !locationupdated) {
        setCurrentRegion(userLocation);
        setUserLocationHasBeenSet(true);
        onUserLocationChange(userLocation);

        setTimeout(() => {
          mapRef.current.animateToRegion(userLocation, 1000);
          onMapReady();
          setLocationUpdated(true);
        }, 1000);
      }

      const minuteduration = moment
        .duration(moment().diff(moment(minutetimer)))
        .minutes();

      if (minuteduration > -1) {
        onUserLocationChange(userLocation);
        setMinuteTimer(new Date().getTime());
      }
    }, [region]);

    const changeUserLocation = location => {
      const { latitude, longitude, timestamp } = location;
      if (latitude && timestamp) {
        const userLocation = { ...defaultRegion, latitude, longitude };

        if (moment.duration(moment().diff(moment(minutetimer))).seconds >= 5) {
          onUserLocationChange(userLocation);
          setMinuteTimer(new Date().getTime());
        }

        if (!initialuserlocationset) {
          onUserLocationChange(userLocation);
          setUserLocationHasBeenSet(true);
        }
      }
    };

    const mapReady = () => {
      setMapReady(true);
      if (simplemap) {
        onMapReady();
      }
    };

    return (
      <Block absolute>
        <RNMapView
          initialRegion={
            region.latitude ? { ...defaultRegion, ...region } : defaultRegion
          }
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1, ...style }}
          minZoomLevel={minZoom}
          ref={composeRefs(mapRef, externalRef)}
          onRegionChange={regionChanged}
          onRegionChangeComplete={regionChangeComplete}
          onMapReady={mapReady}
          onPress={onPress}
          showsUserLocation
          onUserLocationChange={changeUserLocation}
          followsUserLocation
          {...props}
        >
          {mapready ? children : null}
        </RNMapView>
      </Block>
    );
  }
);

MapView.defaultProps = {
  region: {},
  onRegionChange: () => {},
  onUserLocationChange: () => {},
  onLocationChange: () => {},
  minZoom: 2,
  style: {},
  simplemap: false
};

export default MapView;

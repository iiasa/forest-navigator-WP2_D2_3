# EC Forest Navigator project. Deliverable D2.3, https://www.forestnavigator.eu/
# forest4model datacube version 2

## What is the datacube version 2?

The development of the ForestNavigator forest geodatabase was the first important project step for compiling key data sources in WP2 for downstream uptake in the various data analysis and modelling WPs (“forest4model” datacube v1, D2.1 (September 2023). The database includes an updated “picture” of the current and recent forest status and change. Generating the database combines different data streams from remote sensing, statistics, and inventories for a consistent and comprehensive dynamic representation of forests for a spatially explicit assessment of forest changes, aboveground biomass/carbon stocks, forest age, and structural diversity. The following criteria have been defined as important and guiding for the database development:
● Consistent: integrating remote sensing, field data and (where needed/possible) reconciling with national and (sub)national statistics.
● Spatially distributed and high-resolution: make best use of available remote sensing data and tools, able to bridge the different scales and obtain more punctual information on forest status and change.
● Comprehensive: includes key baseline forest information and, in particular, covers dimensions that have not been extensively covered in the past (e.g. climate, biodiversity).
● Transparent: data should be open source and easy to find, accessible, interoperable, and reusable - allowing reproducibility and stimulating understanding and sharing among many stakeholders.
● Timely: need to address rapid changes happening in European forests, i.e. all data should be 2020 for version 1, and for version 2, we curate more recent data.
● EU-wide: cover the entire region at the same level of detail and quality.
The first instalment of the forest geodatabase was a findable, accessible, interoperable, and reusable (FAIR) multi-layered harmonised geodatabase representing the near past (2000-2020) and containing 14 data layers that present the status of EU forests, usable for carbon and biodiversity monitoring and modelling.
Following version 1 of the forest database ("forest4model” datacube v1), we updated the forest geodatabase. Main updates to v2 include: (1) more recent data sets such as disturbance data extending to 2023 and forest biomass maps for 2010, 2015, 2022, to complement 2020 data in v1 and (2) new forest variables such as disturbance agent and forest timber volume. Section 2 outlines the updated data sets and methodology for the “forest4model” datacube v2.



## Documentation of D2.3:
FN_Documentation.pdf

The report describes the data delivered in D2.3, which consists of the second version of the forest geodatabase ("forest4model” datacube) and the updated EUFo database. This report provides a brief summary of the data layers included in D2.3 compared to D2.1 and D2.2, the methods applied, existing data sources used, and data curation efforts to date. Existing and planned validation steps of the data are also briefly described.


## General metadata of the datacube version 2:

references=EC Forest Navigator project. Deliverable D2.3, https://www.forestnavigator.eu/
title=forest4model datacube version 2
source=Earth Observation-based products.
history=Combining Earth Observation-based products to identify forest variables for Europe. The datasets were upscaled to 100 m spatial resolution.
geo_region=Europe
spatial_resolution=100 m pixel size
add_offset=0
scale_factor=1
_FillValue=-9999
institution=GFZ Helmholtz Centre for Geosciences
authors=Alexandra Runge
contact=runge@gfz.de
Conventions=CF-1.12


## What individual datalayers are included in the datacube version 2, and their key metadata variables?

NETCDF_VARNAME=disturbance_year
description=Forest disturbance years in Europe (50N-60N, 0E-10E). Data base is the European Forest Disturbance Atlas.
_FillValue=-9999
axis=Z
long_name=Disturbance_year
units=years
valid_max=2023
valid_min=1985
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=European Forest Disturbance Atlas; https://zenodo.org/records/13333034
description=The year of disturbance events
history=Resampling the original data to 100 m, masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=1985-2023
grid_mapping=spatial_ref



NETCDF_VARNAME=disturbance_fraction
description=Forest disturbance fraction in Europe (50N-60N, 0E-10E). Data base is the European Forest Disturbance Atlas.
_FillValue=-9999
axis=Z
long_name=Disturbance_fraction
units=adimensional
valid_max=1
valid_min=0
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=European Forest Disturbance Atlas; https://zenodo.org/records/13333034
description=The fraction of disturbance (30m spatial resolution) in 100 m spatial resolution
history=Converting the disturbance year data to binary, resampling the data to 100 m, masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=1985-2023
grid_mapping=spatial_ref



NETCDF_VARNAME=disturbance_agent
description=Forest disturbance agent in Europe (50N-60N, 0E-10E). Data base is the European Forest Disturbance Atlas.
_FillValue=-9999
axis=Z
long_name=Disturbance_agent
units=adimensional
valid_max=4
valid_min=1
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=European Forest Disturbance Atlas; https://zenodo.org/records/13333034
description=The dominant disturbance agent at 100 m spatial resolution. 1 = wind/bark beetle , 2 = fire , 3 = harvest, 4 = mixed
history=Resampling the data to 100 m, masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=1985-2023
grid_mapping=spatial_ref



NETCDF_VARNAME=Forest_agb_2022
description=Forest aboveground biomass 2022 in Europe (50N-60N, 0E-10E). Data base is the ESA CCI biomass v6 data.
_FillValue=-9999
axis=Z
long_name=Forest aboveground biomas (AGB) 2022 in Mg ha-1
units=Mg ha-1
valid_max=414
valid_min=1
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=ESA CCI Biomass, climate.esa.int/en/projects/biomass/
description=The forest aboveground biomass 2022 at 100 m spatial resolution.
history=Masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=2022
grid_mapping=spatial_ref



NETCDF_VARNAME=Forest_agb_2015
description=Forest aboveground biomass 2015 in Europe (50N-60N, 0E-10E). Data base is the ESA CCI biomass v6 data.
_FillValue=-9999
axis=Z
long_name=Forest aboveground biomas (AGB) 2015 in Mg ha-1
units=Mg ha-1
valid_max=421
valid_min=1
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=ESA CCI Biomass, climate.esa.int/en/projects/biomass/
description=The forest aboveground biomass 2015 at 100 m spatial resolution.
history=Masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=2015
grid_mapping=spatial_ref


NETCDF_VARNAME=Forest_agb_2010
description=Forest aboveground biomass 2015 in Europe (50N-60N, 0E-10E). Data base is the ESA CCI biomass v6 data.
_FillValue=-9999
axis=Z
long_name=Forest aboveground biomas (AGB) 2010 in Mg ha-1
units=Mg ha-1
valid_max=410
valid_min=1
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=ESA CCI Biomass, v6, climate.esa.int/en/projects/biomass/
description=The forest aboveground biomass 2010 at 100 m spatial resolution.
history=Masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=2010
grid_mapping=spatial_ref


NETCDF_VARNAME=Forest_agb_2020
description=Forest aboveground biomass 2015 in Europe (50N-60N, 0E-10E). Data base is the ESA CCI biomass v6 data.
_FillValue=-9999
axis=Z
long_name=Forest aboveground biomas (AGB) 2020 in Mg ha-1
units=Mg ha-1
valid_max=422
valid_min=1
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=ESA CCI Biomass, v6, climate.esa.int/en/projects/biomass/
description=The forest aboveground biomass 2020 at 100 m spatial resolution.
history=Masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=2020
grid_mapping=spatial_ref


NETCDF_VARNAME=Timber_volume
description=Forest timber volume 2015 in Europe (50N-60N, 0E-10E). Data base is the PathFinder High-Resolution Pan-European Forest Structure Datasets.
_FillValue=-9999
axis=Z
long_name=Forest timber volume
units=m-3/ha
valid_max=757
valid_min=1
coordinates=lat lon
scale_factor=1.0
add_offset=0.0
references=High_resolution Pan-European Forest Structure Maps, https://doi.org/10.5281/zenodo.13143235
description=The forest timber volume 2020 at 100 m spatial resolution.
history=Resampling the data to 100 m, masking with the forest cover (2020) dataset from datacube v1, reprojecting to WGS84
temporal_coverage=2020
grid_mapping=spatial_ref


## Questions

Please contact Alexandra Runge, GFZ (alexandra.runge@gfz.de) with any questions.

## Citation

If you use this data, please cite: the *EC Forest Navigator project. Deliverable D2.3, https://www.forestnavigator.eu/*


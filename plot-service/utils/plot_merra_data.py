import numpy as np
from netCDF4 import Dataset
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import os

def plot_merra(file, request_data):
    merra_data= Dataset(file, mode='r')
    request_id = request_data.get('request_id')
    fig = plt.figure(figsize=(8,4))
    ax = plt.axes(projection=ccrs.Robinson())
    ax.set_global()
    ax.coastlines(resolution="110m",linewidth=1)
    ax.gridlines(linestyle='--',color='black')

    lons = merra_data.variables['lon'][:]
    lats = merra_data.variables['lat'][:]
    T2M = merra_data.variables['TLML'][:,:,:]  #surface specific humidity 
    T2M = T2M[0,:,:]

    # Set contour levels, then draw the plot and a colorbar
    contour_levels = np.arange(230,311,5)
    plt.contourf(lons, lats, T2M, contour_levels, transform=ccrs.PlateCarree(),cmap=plt.cm.jet)
    plt.title('MERRA-2 Air Temperature at 2m, January 2010', size=14)
    color_bar = plt.colorbar(ax=ax, orientation="vertical", pad=0.02, aspect=16, shrink=0.8)
    color_bar.set_label('K',size=12,rotation=0,labelpad=15)
    color_bar.ax.tick_params(labelsize=10)

    plt.savefig(f'{request_id}.png')

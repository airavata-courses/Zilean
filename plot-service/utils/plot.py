import matplotlib
matplotlib.pyplot.switch_backend('agg')
import matplotlib.pyplot as plt
from metpy.plots import add_metpy_logo, add_timestamp
import numpy as np
from netCDF4 import Dataset
import os
import cartopy.crs as ccrs


def plot_nexrad_data(f, request_id):
    sweep = 0
    az = np.array([ray[0].az_angle for ray in f.sweeps[sweep]])
    diff = np.diff(az)
    diff[diff > 180] -= 360.
    diff[diff < -180] += 360.
    avg_spacing = diff.mean()
    az = (az[:-1] + az[1:]) / 2
    az = np.concatenate(([az[0] - avg_spacing], az, [az[-1] + avg_spacing]))

    ref_hdr = f.sweeps[sweep][0][4][b'REF'][0]
    ref_range = (np.arange(
        ref_hdr.num_gates + 1) - 0.5) * ref_hdr.gate_width + ref_hdr.first_gate
    ref = np.array([ray[4][b'REF'][1] for ray in f.sweeps[sweep]])

    rho_hdr = f.sweeps[sweep][0][4][b'RHO'][0]
    rho_range = (np.arange(
        rho_hdr.num_gates + 1) - 0.5) * rho_hdr.gate_width + rho_hdr.first_gate
    rho = np.array([ray[4][b'RHO'][1] for ray in f.sweeps[sweep]])

    fig, axes = plt.subplots(1, 2, figsize=(15, 8))
    add_metpy_logo(fig, 190, 85, size='large')
    for var_data, var_range, ax in zip((ref, rho), (ref_range, rho_range),
                                       axes):
        # Turn into an array, then mask
        data = np.ma.array(var_data)
        data[np.isnan(data)] = np.ma.masked

        # Convert az,range to x,y
        xlocs = var_range * np.sin(np.deg2rad(az[:, np.newaxis]))
        ylocs = var_range * np.cos(np.deg2rad(az[:, np.newaxis]))

        # Plot the data
        ax.pcolormesh(xlocs, ylocs, data, cmap='viridis')
        ax.set_aspect('equal', 'datalim')
        ax.set_xlim(-40, 20)
        ax.set_ylim(-30, 30)
        add_timestamp(ax, f.dt, y=0.02, high_contrast=True)
    plt.savefig(f'{request_id}.png')
    plt.close()


def plot_merra_data(file, request_data):
    merra_data= Dataset(file, mode='r')
    request_id = request_data.get('request_id')
    print(request_id)
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
    plt.title('MERRA-2 Air Temperature', size=14)
    color_bar = plt.colorbar(ax=ax, orientation="vertical", pad=0.02, aspect=16, shrink=0.8)
    color_bar.set_label('K',size=12,rotation=0,labelpad=15)
    color_bar.ax.tick_params(labelsize=10)

    plt.savefig(f'{request_id}.png')
    plt.close()


def convert_merra_data(file, request_data):

    hour = int(request_data.get('hour'))
    merra_data = Dataset(file, mode='r')
    T2M = merra_data.variables['TLML'][:,:,:]
    T2M = T2M[hour,:,:]

    filename = file + ".csv"

    data = np.array(T2M)

    np.savetxt(filename, data,delimiter=",")
    data.close()
    os.remove(os.getcwd()+"/"+file)
    print('File Removed')

    return filename
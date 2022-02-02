import matplotlib
matplotlib.pyplot.switch_backend('agg')
import matplotlib.pyplot as plt
from metpy.plots import add_metpy_logo, add_timestamp
import numpy as np


def plot_data(f, user_id):
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
    plt.savefig('plan')

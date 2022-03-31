from netCDF4 import Dataset
import os
import os
from netCDF4 import Dataset
import numpy as np

def dataConversion(file, request_data):

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
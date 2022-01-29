import Head from "next/head";

import styles from "../styles/Home.module.css";
import Link from "next/dist/client/link";
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter();
  
  const onPlotDataButtonHandler = (e) => {
    e.preventDefault();
    console.log("Clicked");
    router.push('/user-input');
  };

  return (
    // <div className={styles.container}>
    <div>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Generated by create next app" />c
      </Head>
      <div styles={{ "text-align": "justify" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPlotDataButtonHandler}
          >
            Plot Data
          </button>
        <p>
          Welcome to our Weather App. Please click on Plot Data if you want to
          plot NEXRAD data
        </p>
        <h3>What is NEXRAD dataset??</h3>
        <p>
          This dataset consists of Level II weather radar data collected from
          Next-Generation Radar (NEXRAD) stations located in the contiguous
          United States, Alaska, Hawaii, U.S. territories and at military base
          sites. NEXRAD is a network of 160 high-resolution Doppler weather
          radars operated by the NOAA National Weather Service (NWS), the
          Federal Aviation Administration (FAA), and the U.S. Air Force (USAF).
          Doppler radars detect atmospheric precipitation and winds, which allow
          scientists to track and anticipate weather events, such as rain, ice
          pellets, snow, hail, and tornadoes, as well as some non-weather
          objects like birds and insects. NEXRAD stations use the Weather
          Surveillance Radar - 1988, Doppler (WSR-88D) system. This is a 10 cm
          wavelength (S-Band) radar that operates at a frequency between 2,700
          and 3,000 MHz. The radar system operates in two basic modes: a
          slow-scanning Clear Air Mode (Mode B) for analyzing air movements when
          there is little or no precipitation activity in the area, and a
          Precipitation Mode (Mode A) with a faster scan for tracking active
          weather. The two modes employ nine Volume Coverage Patterns (VCPs) to
          adequately sample the atmosphere based on weather conditions. A VCP is
          a series of 360 degree sweeps of the antenna at pre-determined
          elevation angles and pulse repetition frequencies completed in a
          specified period of time. The radar scan times 4.5, 5, 6 or 10 minutes
          depending on the selected VCP.The NEXRAD products are divided into
          multiple data processing levels. The lower Level II data contain the
          three meteorological base data quantities at original resolution:
          reflectivity, mean radial velocity, and spectrum width. With the
          advent of dual polarization beginning in 2011, additional base
          products of differential reflectivity, correlation coefficient and
          differential phase are available. Level II data are recorded at all
          NWS and most USAF and FAA WSR-88D sites. From the Level II quantities,
          computer processing generates numerous meteorological analysis Level 3
          products. NEXRAD data are acquired by the NOAA National Centers for
          Environmental Information (NCEI) for archiving and dissemination to
          users. Data coverage varies by station and ranges from June 1991 to 1
          day from present. Most stations began observing in the mid-1990s, and
          most period of records are continuous.
        </p>
      </div>

      <main className={styles.main}></main>
    </div>
  );
}



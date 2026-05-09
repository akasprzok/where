from etl.sources.noaa_climate import fetch


def test_climate_loads():
    df = fetch()
    tx = df[df["code"] == "TX"].iloc[0]
    assert tx["avgTempF"] == 65
    assert tx["sunDaysPerYear"] == 230

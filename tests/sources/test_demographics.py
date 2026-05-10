from etl.sources.census_demographics import fetch


def test_demographics_loads():
    df = fetch()
    tx = df[df["code"] == "TX"].iloc[0]
    assert tx["population"] == 30000000
    assert tx["medianAge"] == 35.4

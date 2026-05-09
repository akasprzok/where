from etl.sources.bea_col import fetch


def test_rpp_loads():
    df = fetch()
    tx = df[df["code"] == "TX"].iloc[0]
    assert tx["rpp"] == 0.97

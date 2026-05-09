from etl.sources.manual import fetch


def test_manual_returns_dataframe_keyed_by_state():
    df = fetch()
    assert "code" in df.columns
    assert "politicsLean" in df.columns
    assert df.loc[df["code"] == "TX", "politicsLean"].iloc[0] == 25
    assert df.loc[df["code"] == "CA", "outdoorRecRating"].iloc[0] == 85

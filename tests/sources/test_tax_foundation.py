from etl.sources.tax_foundation import fetch


def test_tax_foundation_loads_rates_and_brackets():
    df = fetch()
    assert "code" in df.columns
    tx = df[df["code"] == "TX"].iloc[0]
    assert tx["salesRate"] == 0.0625
    assert tx["incomeBrackets"] == []
    ca = df[df["code"] == "CA"].iloc[0]
    assert ca["incomeBrackets"][0]["filingStatus"] == "single"
    assert ca["incomeBrackets"][0]["rateBps"] == 100

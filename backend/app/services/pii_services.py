import spacy

# Lazy-load the NLP model on first use to speed up server startup
_nlp = None

def _get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp

def scrub_pii(text: str) -> str:
    nlp = _get_nlp()
    doc = nlp(text)
    scrubbed_text = text
    # Masking Persons, Locations, and Organizations
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "GPE", "ORG"]:
            scrubbed_text = scrubbed_text.replace(ent.text, f"[{ent.label_}]")
    return scrubbed_text
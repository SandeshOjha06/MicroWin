import spacy

# Load the NLP model (ensure you've run: python -m spacy download en_core_web_sm)
nlp = spacy.load("en_core_web_sm")

def scrub_pii(text: str) -> str:
    doc = nlp(text)
    scrubbed_text = text
    # Masking Persons, Locations, and Organizations
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "GPE", "ORG"]:
            scrubbed_text = scrubbed_text.replace(ent.text, f"[{ent.label_}]")
        
    print(f"Masked Text: {scrubbed_text}")
    return scrubbed_text
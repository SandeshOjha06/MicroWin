# uses Spacy for Pii encoding and decoding
import spacy

nlp = spacy.load("en_core_web_sm")

def mask_pii(text: str) -> str:
    doc = nlp(text)
    for ent in doc.ents:
        # Mask Names, Locations, and Phone Numbers
        if ent.label_ in ["PERSON", "GPE", "PHONE"]:
            text = text.replace(ent.text, f"[{ent.label_}]")
    return text
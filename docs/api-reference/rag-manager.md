# RAG Manager API Reference

Manage vector stores and retrieval operations.

## Class: `RAGManager`

```python
from langvel.rag.manager import RAGManager
```

### Methods

#### `retrieve()`

```python
rag = RAGManager()
docs = await rag.retrieve(
    query="What is Langvel?",
    collection="docs",
    k=5
)
```

#### `add_documents()`

```python
await rag.add_documents(
    documents=["Doc 1", "Doc 2"],
    collection="docs",
    metadata=[{"source": "..."}, ...]
)
```

## Supported Providers

- **Chroma** (local)
- **Pinecone** (cloud)
- **Weaviate** (cloud)

## Configuration

```python
# config/langvel.py
RAG_PROVIDER = 'chroma'
RAG_EMBEDDING_MODEL = 'openai/text-embedding-3-small'
```

## See Also

- [RAG Integration Guide](/advanced/rag-integration)
- [Tools API](/api-reference/tools)
